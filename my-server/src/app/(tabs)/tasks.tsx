import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { ITask, ILookup } from "@/types/tasks/ITask";
import { TaskModal } from "@/components/form/TaskModal";
import { TaskFormType } from "@/schemas/TaskSchema";
import { tasksApi } from "@/api/taskApi";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [statuses, setStatuses] = useState<ILookup[]>([]);
  const [priorities, setPriorities] = useState<ILookup[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>();

  // Модальне вікно
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Завантаження словників (статуси, пріоритети)
  const loadLookups = async () => {
    try {
      const [statusesData, prioritiesData] = await Promise.all([
        tasksApi.getStatuses(),
        tasksApi.getPriorities(),
      ]);
      setStatuses(statusesData);
      setPriorities(prioritiesData);
    } catch (error) {
      console.error("Failed to load lookups", error);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getAll({
        search: search.trim() ? search : undefined,
        statusId: selectedStatus,
      });
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => {
    loadLookups();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (task: ITask) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleFormSubmit = async (data: TaskFormType) => {
    try {
      setSubmitting(true);
      if (editingTask) {
        await tasksApi.update(editingTask.id, data);
      } else {
        await tasksApi.create(data);
      }
      setModalVisible(false);
      fetchTasks();
    } catch (error) {
      console.error("Failed to save task", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await tasksApi.remove(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-12 px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-900">Мої завдання</Text>
        <TouchableOpacity
          onPress={handleOpenCreate}
          className="bg-blue-600 px-4 py-2.5 rounded-xl shadow-md shadow-blue-200"
        >
          <Text className="text-white font-semibold text-sm">+ Нове</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="mb-3">
        <TextInput
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm shadow-sm"
          placeholder="Пошук завдань..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Status Filter Chips */}
      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: undefined, name: "Всі" }, ...statuses]}
          keyExtractor={(item) => String(item.id ?? "all")}
          renderItem={({ item }) => {
            const isActive = selectedStatus === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedStatus(item.id)}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  isActive ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"
                }`}
              >
                <Text className={`text-xs font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Task List */}
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOpenEdit(item)}
              className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-1">
                <Text className="text-base font-semibold text-gray-900 flex-1 mr-2">
                  {item.title}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-1">
                  <Text className="text-red-400 font-bold">🗑️</Text>
                </TouchableOpacity>
              </View>

              {item.description ? (
                <Text className="text-gray-500 text-xs mb-3" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}

              <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
                <View className="flex-row gap-2">
                  <View className="bg-blue-50 px-2.5 py-1 rounded-md">
                    <Text className="text-blue-700 text-[10px] font-semibold">{item.status}</Text>
                  </View>
                  <View className="bg-amber-50 px-2.5 py-1 rounded-md">
                    <Text className="text-amber-700 text-[10px] font-semibold">{item.priority}</Text>
                  </View>
                </View>
                {item.dueDate && (
                  <Text className="text-gray-400 text-xs">📅 {item.dueDate}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="py-20 items-center">
              <Text className="text-gray-400 text-sm">Список завдань порожній</Text>
            </View>
          }
        />
      )}

      {/* Modal Form */}
      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        taskToEdit={editingTask}
        statuses={statuses}
        priorities={priorities}
        loading={submitting}
      />
    </View>
  );
}