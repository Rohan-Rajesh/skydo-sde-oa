/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "../utils/axios.config";
import dayjs from "dayjs";
import { io } from "socket.io-client";
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
  Switch,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { MdDelete, MdCheck, MdLogin, MdLogout } from "react-icons/md";

import { Task, TaskUser } from "@/types/Task";
import { User } from "@/types/User";
import styles from "./page.module.css";
import AddTaskForm from "@/components/AddTaskForm";
import EditTaskForm from "@/components/EditTaskForm";
import { priorities, status } from "@/utils/constants";

interface TaskResult {
  task: Task;
  user: TaskUser;
}

const socket = io("http://localhost:8080");

export default function Home() {
  const [userDetails, setUserDetails] = useState<User>({});
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  // const googleAccessToken = localStorage.getItem("googleAccessToken");

  const getTasks = async () => {
    const response = await axios.post("/task/getTasks", {
      completeFlag: showCompletedTasks ? 1 : 0,
    });
    setTasks(response.data);
  };

  useEffect(() => {
    getTasks();
  }, [showCompletedTasks]);

  useEffect(() => {
    const userDetailsStr = localStorage.getItem("user");

    if (userDetailsStr && userDetailsStr.length > 0) {
      setUserDetails(JSON.parse(userDetailsStr).user);
    }
  }, []);

  useEffect(() => {
    socket.on("taskUpdate", () => {
      console.log("running");
      getTasks();
    });

    return () => {
      socket.off("taskUpdate");
    };
  }, []);
  const updateSocket = () => {
    socket.emit("taskUpdate");
  };

  const handleGoogleLogin = () => {
    const client = (window as any).google.accounts.oauth2.initCodeClient({
      client_id:
        "982082306117-5levp1sfnsemva9op8ukinohqg9lbr5s.apps.googleusercontent.com",
      scope: "openid email profile https://www.googleapis.com/auth/calendar",
      ux_mode: "popup",
      redirect_uri: "postmessage",
      callback: async ({ code }: { code: string }) => {
        const response = await axios.post("/user/google/callback", {
          code,
        });

        localStorage.setItem("user", JSON.stringify(response.data));
        setUserDetails(response.data.user);
      },
    });

    client.requestCode();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserDetails({});
  };

  const handleAddTask = async (taskData: Task) => {
    const response = await axios.post("/task/addTask", { task: taskData });

    if (response.data.status === 1) {
      setTasks([response.data.taskData, ...tasks]);

      updateSocket();
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

  const handleChangeTaskStatus = async (task: Task) => {
    const response = await axios.post("/task/changeTaskStatus", {
      taskId: task.id,
      status: task.status + 1,
    });

    if (response.data.status === 1) {
      toaster.create({
        title: `Successfully ${
          task.status === 0 ? "started" : "completed"
        } task!`,
        type: "success",
      });

      getTasks();
      updateSocket();
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
      updateSocket();
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
          {userDetails && userDetails.id ? (
            <div>
              <AddTaskForm handleAddTask={handleAddTask} />
              <Button
                colorPalette="red"
                variant="surface"
                className={styles.button}
                onClick={handleLogout}
              >
                <MdLogout /> Log Out?
              </Button>
            </div>
          ) : (
            <Button
              colorPalette="green"
              variant="surface"
              className={styles.button}
              onClick={handleGoogleLogin}
            >
              <MdLogin /> Login
            </Button>
          )}
        </div>
        <div className={styles.showCompletedTasks}>
          <div />
          <div>
            <Switch.Root
              checked={showCompletedTasks}
              onCheckedChange={(e) => setShowCompletedTasks(e.checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label>Show Completed Tasks?</Switch.Label>
            </Switch.Root>
          </div>
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
                    {task.task.status !== 2 && (
                      <Button
                        colorPalette="green"
                        variant="surface"
                        className={styles.button}
                        onClick={() => {
                          handleChangeTaskStatus(task.task);
                        }}
                      >
                        <MdCheck />{" "}
                        {task.task.status === 0 ? "Start Task" : "Complete"}
                      </Button>
                    )}

                    <EditTaskForm
                      getTasks={getTasks}
                      updateSocket={updateSocket}
                      taskData={task}
                    />
                    <Dialog.Root
                      open={taskToDelete !== null}
                      onOpenChange={(open) => {
                        if (!open) setTaskToDelete(null);
                      }}
                    >
                      <Dialog.Trigger asChild>
                        <Button
                          colorPalette="red"
                          variant="surface"
                          className={styles.button}
                          onClick={() => setTaskToDelete(task.task)}
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
                                  if (taskToDelete) {
                                    handleDeleteTask(taskToDelete);
                                  }
                                  setTaskToDelete(null);
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
