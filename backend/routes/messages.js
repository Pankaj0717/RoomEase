const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiver, listing, content } = req.body;

    const conversation = Message.createConversationId(req.user.id, receiver);

    const message = await Message.create({
      conversation,
      sender: req.user.id,
      receiver,
      listing,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture');

    // Emit socket event
    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const receiverSocketId = connectedUsers.get(receiver);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', populatedMessage);
    }

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get all conversations for a user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversation',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    await Message.populate(conversations, {
      path: 'lastMessage.sender lastMessage.receiver lastMessage.listing',
      select: 'name profilePicture title'
    });

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get messages with a specific user
// @access  Private
router.get('/conversation/:userId', protect, async (req, res) => {
  try {
    const conversation = Message.createConversationId(req.user.id, req.params.userId);

    const messages = await Message.find({ conversation })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .populate('listing', 'title')
      .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      { conversation, receiver: req.user.id, read: false },
      { read: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    message.read = true;
    await message.save();

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;