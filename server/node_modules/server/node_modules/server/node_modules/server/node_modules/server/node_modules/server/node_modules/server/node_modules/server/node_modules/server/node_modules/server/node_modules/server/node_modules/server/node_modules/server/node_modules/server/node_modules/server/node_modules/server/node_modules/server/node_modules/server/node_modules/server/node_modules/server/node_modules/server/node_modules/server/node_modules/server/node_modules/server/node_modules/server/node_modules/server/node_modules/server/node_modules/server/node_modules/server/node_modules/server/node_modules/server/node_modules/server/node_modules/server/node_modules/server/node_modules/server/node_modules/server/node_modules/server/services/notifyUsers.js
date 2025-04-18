import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo,
        },
        returnDate: null,
        notified: false,
      });

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          await User.findById(element.user.id);
          sendEmail({
            email: element.user.email,
            subject: "Book Return Reminder",
            message: `Dear ${user.name},\n\nThis is a reminder that you have not yet returned the book titled "${element.book.title}" borrowed from our library. Please return the book as soon as possible to avoid any late fees or penalties.\n\nThank you for your cooperation.\n\nBest regards,\nThe Library Team`,
          });
          element.notified = true;
          await element.save();
          console.log("Email sent to:", element.user.email);
        }
      }
    } catch (error) {
      console.error("Error in notifyUsers:", error);
    }
  });
};
