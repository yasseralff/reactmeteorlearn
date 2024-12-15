import { Meteor } from "meteor/meteor";
import React, { useState, Fragment } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from "./LoginForm";

export const App = () => {

  const user = useTracker(() => Meteor.user());

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const [hideCompleted, setHideCompleted] = useState(false);

  const handleDelete = ({ _id }) =>
    Meteor.callAsync("tasks.delete", { _id });

  const handleToggleChecked = ({ _id, isChecked }) => 
    Meteor.callAsync("tasks.toggleChecked", { _id, isChecked });

  // const isLoading = useSubscribe("tasks");

  const pendingTasksCount = useTracker(() => {
    if (!user) {
      return 0;
    }

    return TasksCollection.find(hideCompletedFilter).count()
  });

  const pendingTasksTitle = `${pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;

  const tasks = useTracker(() => {
    const handle = Meteor.subscribe('tasks');
  
    if (!handle.ready()) {
      console.log('Subscription not ready');
      return [];
    }

    console.log('Subscription ready');

    if (!user) {
      return [];
    }

    return TasksCollection.find(
      hideCompleted ? hideCompletedFilter : {},
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
  });

  // if (isLoading()) {
  //   return <div>Loading...</div>;
  // }

  const logout = () => Meteor.logout();

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>
              My To-do list!!!
              {pendingTasksTitle}  
            </h1>
          </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <Fragment>
            <div className="user" onClick={logout}>
              {user.username}
            </div>
            <TaskForm />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={handleToggleChecked}
                  onDeleteClick={handleDelete}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
