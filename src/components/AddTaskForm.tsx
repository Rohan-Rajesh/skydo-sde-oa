import React, { useState, useEffect } from "react";
import axios from "@/utils/axios.config";
import { useFormik } from "formik";
import {
  HStack,
  Drawer,
  Button,
  Portal,
  Field,
  Input,
  CloseButton,
  Textarea,
  RadioCard,
  NativeSelect,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

import { priorities } from "@/utils/constants";
import { Task, TaskUser } from "@/types/Task";
import styles from "../app/page.module.css";

const AddTaskForm: React.FC<{
  handleAddTask: (arg0: Task) => void;
}> = ({ handleAddTask }) => {
  const [users, setUsers] = useState<TaskUser[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.post("/user/getUsers");

      setUsers(response.data);
    };

    getUsers();
  }, []);

  const addTaskFormik = useFormik<Task>({
    initialValues: {
      title: "",
      description: "",
      user: 1,
      priority: 1,
      status: 1,
      startDate: new Date(),
      dueDate: new Date(),
    },
    onSubmit: (values) => {
      handleAddTask(values);
    },
  });

  return (
    <Drawer.Root size="sm">
      <Drawer.Trigger asChild>
        <Button
          colorPalette="green"
          variant="surface"
          className={styles.button}
        >
          <MdAdd /> Add Task
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content className={styles.drawerContent}>
            <Drawer.Header>
              <Drawer.Title className={styles.drawerTitle}>
                Add Task
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <div>
                <Field.Root required className={styles.inputContainer}>
                  <Field.Label>
                    Title <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    id="title"
                    name="title"
                    colorPalette="blue"
                    className={styles.input}
                    value={addTaskFormik.values.title}
                    onChange={addTaskFormik.handleChange}
                    onBlur={addTaskFormik.handleBlur}
                  />
                </Field.Root>
                <Field.Root required className={styles.inputContainer}>
                  <Field.Label>
                    Description <Field.RequiredIndicator />
                  </Field.Label>
                  <Textarea
                    id="description"
                    name="description"
                    variant="outline"
                    colorPalette="blue"
                    height="100px"
                    autoresize
                    className={styles.input}
                    value={addTaskFormik.values.description}
                    onChange={addTaskFormik.handleChange}
                    onBlur={addTaskFormik.handleBlur}
                  />
                </Field.Root>
                <RadioCard.Root
                  defaultValue="1"
                  style={{ marginTop: "20px" }}
                  id="priority"
                  name="priority"
                  onChange={addTaskFormik.handleChange}
                  onBlur={addTaskFormik.handleBlur}
                  value={addTaskFormik.values.priority.toString()}
                >
                  <RadioCard.Label>Priority</RadioCard.Label>
                  <HStack align="stretch">
                    {priorities.map((priority) => (
                      <RadioCard.Item
                        key={priority.id}
                        value={priority.id.toString()}
                        className={styles.priorityCard}
                        colorPalette={priority.colorPalette}
                      >
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemText>
                            {priority.displayName}
                          </RadioCard.ItemText>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </HStack>
                </RadioCard.Root>
                <Field.Root className={styles.inputContainer}>
                  <Field.Label>
                    Assign To <Field.RequiredIndicator />
                  </Field.Label>
                  <NativeSelect.Root size="md" width="240px">
                    <NativeSelect.Field
                      placeholder="Select user"
                      className={styles.input}
                      value={addTaskFormik.values.user}
                      onChange={addTaskFormik.handleChange}
                      onBlur={addTaskFormik.handleBlur}
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
                <Field.Root required className={styles.inputContainer}>
                  <Field.Label>
                    Start Date <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    colorPalette="blue"
                    type="date"
                    className={styles.input}
                    value={addTaskFormik.values.startDate.toString()}
                    onChange={addTaskFormik.handleChange}
                    onBlur={addTaskFormik.handleBlur}
                  />
                </Field.Root>
                <Field.Root required className={styles.inputContainer}>
                  <Field.Label>
                    Due Date <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    colorPalette="blue"
                    type="date"
                    className={styles.input}
                    value={addTaskFormik.values.dueDate.toString()}
                    onChange={addTaskFormik.handleChange}
                    onBlur={addTaskFormik.handleBlur}
                  />
                </Field.Root>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" className={styles.button}>
                Cancel
              </Button>
              <Button
                className={styles.button}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  addTaskFormik.handleSubmit();
                }}
              >
                Add Task
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default AddTaskForm;
