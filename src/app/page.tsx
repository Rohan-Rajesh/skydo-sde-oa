"use client";

import React, { useState, useEffect } from "react";
import axios from "../utils/axios.config";
import dayjs from "dayjs";
import {
  Heading,
  Card,
  Button,
  DataList,
  Highlight,
  Link,
  CloseButton,
  Dialog,
  Portal,
  Drawer,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdCheck } from "react-icons/md";

import { Task } from "@/types/Task";
import styles from "./page.module.css";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      const response = await axios.post("/task/getTasks");
      setTasks(response.data);
    };

    getTasks();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Heading size="4xl" className={styles.title}>
          Skydo Task management
        </Heading>
        <div className={styles.cardsContainer}>
          {tasks.map((task) => (
            <div key={task.id}>
              <Card.Root className={styles.card}>
                <Card.Body gap="2">
                  <Card.Title mt="2">{task.title}</Card.Title>
                  <Card.Description>{task.description}</Card.Description>
                  <DataList.Root
                    orientation="horizontal"
                    className={styles.cardDetails}
                  >
                    <DataList.Item>
                      <DataList.ItemLabel>Assigned to</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Link href="">@ {task.user}</Link>
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Priority</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Highlight
                          query="High"
                          styles={{
                            px: "0.5",
                            bg: "red.subtle",
                            color: "orange.fg",
                          }}
                        >
                          High
                        </Highlight>
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Status</DataList.ItemLabel>
                      <DataList.ItemValue>{task.status}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Start Date</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {dayjs(task.startDate).format("d MMM")}
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Due Date</DataList.ItemLabel>
                      <DataList.ItemValue>15th June 2025</DataList.ItemValue>
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
                    >
                      <MdCheck /> Complete
                    </Button>
                    <Drawer.Root>
                      <Drawer.Trigger asChild>
                        <Button
                          colorPalette="teal"
                          variant="surface"
                          className={styles.button}
                        >
                          <MdEdit /> Edit
                        </Button>
                      </Drawer.Trigger>
                      <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                          <Drawer.Content className={styles.editTask}>
                            <Drawer.Header>
                              <Drawer.Title>Drawer Title</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </Drawer.Body>
                            <Drawer.Footer>
                              <Button
                                variant="outline"
                                className={styles.button}
                              >
                                Cancel
                              </Button>
                              <Button className={styles.button}>Save</Button>
                            </Drawer.Footer>
                            <Drawer.CloseTrigger asChild>
                              <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                          </Drawer.Content>
                        </Drawer.Positioner>
                      </Portal>
                    </Drawer.Root>
                    <Dialog.Root>
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
                              <Dialog.Title>Dialog Title</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body style={{ marginBottom: "20px" }}>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
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
                              <Button className={styles.button}>Save</Button>
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
    </div>
  );
}
