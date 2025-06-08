"use client";

import React, { useState, useEffect } from "react";
import axios from "../utils/axios.config";
import dayjs from "dayjs";
import {
  Heading,
  Card,
  Button,
  DataList,
  Link,
  CloseButton,
  Dialog,
  Portal,
  Badge,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { MdDelete, MdCheck } from "react-icons/md";

import { Task, TaskUser } from "@/types/Task";
import styles from "./page.module.css";
import AddTaskForm from "@/components/AddTaskForm";
import EditTaskForm from "@/components/EditTaskForm";
import { priorities, status } from "@/utils/constants";

interface TaskResult {
  task: Task;
  user: TaskUser;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [deleteDialogState, setDeleteDialogState] = useState(false);

  const getTasks = async () => {
    const response = await axios.post("/task/getTasks");
    setTasks(response.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleAddTask = async (taskData: Task) => {
    const response = await axios.post("/task/addTask", taskData);

    if (response.data.status === 1) {
      setTasks([response.data.taskData, ...tasks]);

      toaster.create({
        title: "Successfully added task!",
        type: "success",
      });
    } else {
      toaster.create({
        title: "Error occurred when creating task, please try again",
        type: "error",
      });
    }
  };

  const handleCompleteTask = async (task: Task) => {
    const response = await axios.post("/task/completeTask", {
      taskId: task.id,
    });

    if (response.data.status === 1) {
      getTasks();

      toaster.create({
        title: "Successfully completed task!",
        type: "success",
      });
    } else {
      toaster.create({
        title: "Error occurred when completing task, please try again",
        type: "error",
      });
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const response = await axios.post("/task/deleteTask", {
      taskId: task.id,
    });

    if (response.data.status === 1) {
      getTasks();
    } else {
      toaster.create({
        title: "Error occurred when deleting task, please try again",
        type: "error",
      });
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <Heading size="4xl" className={styles.title}>
            Skydo Task management
          </Heading>
          <AddTaskForm handleAddTask={handleAddTask} />
        </div>
        <div className={styles.cardsContainer}>
          {tasks.map((task) => (
            <div key={task.task.id}>
              <Card.Root className={styles.card}>
                <Card.Body gap="2">
                  <Card.Title mt="2">{task.task.title}</Card.Title>
                  <Card.Description>{task.task.description}</Card.Description>
                  <DataList.Root
                    orientation="horizontal"
                    className={styles.cardDetails}
                  >
                    <DataList.Item>
                      <DataList.ItemLabel>Assigned to</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Link href="">@ {task.user.name}</Link>
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Priority</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Badge
                          className={styles.badge}
                          colorPalette={
                            priorities[task.task.priority].colorPalette
                          }
                        >
                          {priorities[task.task.priority].displayName}
                        </Badge>
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Status</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Badge
                          className={styles.badge}
                          colorPalette={status[task.task.status].colorPalette}
                        >
                          {status[task.task.status].displayName}
                        </Badge>
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Start Date</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {dayjs(task.task.startDate).format("DD MMM YYYY")}
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Due Date</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {dayjs(task.task.dueDate).format("DD MMM YYYY")}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </Card.Body>
                <Card.Footer className={styles.cardFooter}>
                  <div></div>
                  <span>
                    <Button
                      colorPalette="green"
                      variant="surface"
                      className={styles.button}
                      onClick={() => {
                        handleCompleteTask(task.task);
                      }}
                    >
                      <MdCheck /> Complete
                    </Button>
                    <EditTaskForm getTasks={getTasks} taskData={task} />
                    <Dialog.Root
                      open={deleteDialogState}
                      onOpenChange={(e) => setDeleteDialogState(e.open)}
                    >
                      <Dialog.Trigger asChild>
                        <Button
                          colorPalette="red"
                          variant="surface"
                          className={styles.button}
                        >
                          <MdDelete /> Delete
                        </Button>
                      </Dialog.Trigger>
                      <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                          <Dialog.Content className={styles.deleteDialog}>
                            <Dialog.Header>
                              <Dialog.Title>Confirm Task Deletion</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body style={{ marginBottom: "20px" }}>
                              <p>
                                Are you sure you want to delete this task?
                                Please click delete below to continue...
                              </p>
                            </Dialog.Body>
                            <Dialog.Footer>
                              <Dialog.ActionTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={styles.button}
                                >
                                  Cancel
                                </Button>
                              </Dialog.ActionTrigger>
                              <Button
                                colorPalette="red"
                                className={styles.button}
                                onClick={() => {
                                  handleDeleteTask(task.task);
                                  setDeleteDialogState(false);
                                }}
                              >
                                Delete
                              </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                          </Dialog.Content>
                        </Dialog.Positioner>
                      </Portal>
                    </Dialog.Root>
                  </span>
                </Card.Footer>
              </Card.Root>
            </div>
          ))}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
