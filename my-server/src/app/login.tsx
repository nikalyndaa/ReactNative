import { BASE_URL } from "@/config/api";
import { LoginSchema } from "@/schemas/LoginSchema";
import { ILoginType } from "@/types/login/ILoginType";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const defaultValues: ILoginType = {
    email: "",
    password: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultValues,
  });

  const handleLogin = async (data: ILoginType) => {
    console.log("Login user in Form", data);
    try {
      const result = await axios.post(BASE_URL, data);
      console.log("Login user in Form", result);
    } catch (e) {
      console.log("Login request error", e);
    }
  };

  return (
    <View className="flex-1 bg-slate-50 justify-center px-6">
      <View className="w-full max-w-sm self-center">
        <Text className="text-3xl font-bold text-slate-900 mb-2">
          З поверненням!
        </Text>
        <Text className="text-slate-500 mb-6">
          Введіть свої дані для входу.
        </Text>

        <Text className="text-sm font-medium text-slate-700 mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-1 text-slate-900"
              placeholder="example@mail.com"
              placeholderTextColor="#94a3b8"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-xs mb-3">
            {errors.email.message}
          </Text>
        )}

        <Text className="text-sm font-medium text-slate-700 mb-1 mt-2">
          Пароль
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-1 text-slate-900"
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mb-4">
            {errors.password.message}
          </Text>
        )}

        {serverMessage && (
          <Text className="text-center text-slate-700 mb-3">
            {serverMessage}
          </Text>
        )}

        <TouchableOpacity
          className="w-full bg-blue-600 py-3.5 rounded-xl items-center mb-4 active:bg-blue-700 mt-2"
          onPress={handleSubmit(handleLogin)}
          disabled={loading}
        >
          <Text className="text-white font-semibold text-lg">
            {loading ? "Зачекайте..." : "Увійти"}
          </Text>
        </TouchableOpacity>
        <Link href="/" className="text-center text-blue-600 font-medium">
          ← На головну
        </Link>
      </View>
    </View>
  );
}
