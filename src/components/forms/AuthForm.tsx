import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { RegisterForm, registerSchema, LoginForm, loginSchema } from "./schema";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const { register: authRegister, login } = useAuth();

  if (mode === "register") {
    const form = useForm<RegisterForm>({
      resolver: zodResolver(registerSchema),
      defaultValues: { username: "", email: "", password: "" },
    });
    const onRegister = async (data: RegisterForm) => {
      try {
        await authRegister({
          username: data.username,
          email: data.email,
          password: data.password,
        });
        navigate("/");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast("Registration failed! " + message);
      }
    };

    return (
      <Card className="bg-secondary/60 mx-auto mt-20 p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
            Register
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onRegister)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input id="username" placeholder="username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      console.log(message);
      toast("Login failed! " + message);
    }
  };

  return (
    <Card className="bg-secondary/60 mx-auto mt-20 p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
          Login
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
