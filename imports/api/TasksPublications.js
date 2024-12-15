import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.publish("tasks", function () {
  console.log('Publication triggered for user:', this.userId);

  const userId = this.userId;
  if (!userId) {
    console.log('No user logged in.');
    return this.ready();
  }
  return TasksCollection.find({ userId: this.userId });
});