import LostItem from "../models/LostItem.js";
import Transaction from "../models/Transaction.js";

// -------- Create a lost item (Student / Loster) --------
export async function createLostItem(req, res) {
  try {
    const user = req.user;
    const { title, description, location, secretInfo, bounty, image } = req.body;

    if (!title || !description || !location || !secretInfo || !bounty) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Check bounty balance first
    let account = await Transaction.findOne({ userId: user._id });
    if (!account) {
      account = await Transaction.create({ userId: user._id, balance: 0, history: [] });
    }
    if (account.balance < bounty) {
      return res.status(400).json({ error: "Insufficient token balance for bounty" });
    }

    // Create lost item
    const lostItem = await LostItem.create({
      losterId: user._id,
      losterName: user.fullName,
      title,
      description,
      location,
      secretInfo,
      bounty,
      image: image || null,
      status: "Lost",
      verified: false,
    });

    // Deduct bounty
    account.balance -= bounty;
    account.history.push({
      sender: user.accountAddress,
      receiver: "SYSTEM",
      tokenAmount: bounty,
      type: "Lost",
      date: new Date(),
      itemId: lostItem._id,
    });
    await account.save();

    res.status(201).json({ message: "Lost item reported", lostItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lost item" });
  }
}

// -------- Submit found item (Founder) --------
export async function submitFoundItem(req, res) {
  try {
    const user = req.user;
    const { lostItemId, description, location, image } = req.body;

    if (!lostItemId || !description || !location) {
      return res.status(400).json({ error: "LostItem ID, description, and location required" });
    }

    const lostItem = await LostItem.findById(lostItemId);
    if (!lostItem) return res.status(404).json({ error: "Lost item not found" });

    // Push new request
    lostItem.foundRequests.push({
      founderId: user._id,
      founderName: user.fullName,
      description,
      location,
      image: image || null,
      status: "Pending",
    });

    // Change item status to Verifying
    lostItem.status = "Verifying";

    await lostItem.save();

    res.json({ message: "Found request submitted, waiting for verification", lostItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit found request" });
  }
}

// -------- Loster verifies a found request --------
export async function verifyFoundItem(req, res) {
  try {
    const user = req.user;
    const { lostItemId, requestId, verified } = req.body;

    if (!lostItemId || !requestId || typeof verified !== "boolean") {
      return res.status(400).json({ error: "LostItem ID, request ID, and verified boolean required" });
    }

    const lostItem = await LostItem.findById(lostItemId);
    if (!lostItem) return res.status(404).json({ error: "Lost item not found" });

    if (!lostItem.losterId.equals(user._id)) {
      return res.status(403).json({ error: "Only the original loster can verify" });
    }

    const request = lostItem.foundRequests.id(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (verified) {
      request.status = "Accepted";
      lostItem.status = "Found";
      lostItem.verified = true;

      // Reward this founder
      const founderAccount =
        (await Transaction.findOne({ userId: request.founderId })) ||
        (await Transaction.create({ userId: request.founderId, balance: 0, history: [] }));

      founderAccount.balance += lostItem.bounty;
      founderAccount.history.push({
        sender: user.accountAddress,
        receiver: request.founderId.toString(),
        tokenAmount: lostItem.bounty,
        type: "Reward",
        date: new Date(),
        itemId: lostItem._id,
      });
      await founderAccount.save();

      // Reject all other requests
      lostItem.foundRequests.forEach((r) => {
        if (!r._id.equals(requestId)) {
          r.status = "Rejected";
        }
      });
    } else {
      request.status = "Rejected";
      // Stay in Verifying if no Accepted requests
      if (!lostItem.foundRequests.some((r) => r.status === "Accepted")) {
        lostItem.status = "Verifying";
      }
    }

    await lostItem.save();

    res.json({ message: "Verification updated", lostItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify found item" });
  }
}

// -------- List lost items for current user --------
export async function listLostItems(req, res) {
  try {
    const user = req.user;
    const lostItems = await LostItem.find({ losterId: user._id }).sort({ createdAt: -1 });
    res.json(lostItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch lost items" });
  }
}

// -------- List verifying items (for loster) --------
export async function listVerifyingItems(req, res) {
  try {
    const user = req.user;
    const verifyingItems = await LostItem.find({
      losterId: user._id,
      status: "Verifying",
    }).sort({ createdAt: -1 });
    res.json(verifyingItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch verifying items" });
  }
}

// -------- List all lost items (public feed) --------
export async function listAllLostItems(req, res) {
  try {
    const lostItems = await LostItem.find({})
      .populate("losterId", "fullName email")
      .sort({ createdAt: -1 });

    const result = lostItems.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      location: item.location,
      bounty: item.bounty,
      image: item.image,
      status: item.status,
      verified: item.verified,
      loster: item.losterName,
      foundRequests: item.foundRequests.map((r) => ({
        id: r._id,
        founderName: r.founderName,
        status: r.status,
        date: r.date,
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all lost items" });
  }
}
