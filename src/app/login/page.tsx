// app/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { motion, Variants } from "framer-motion";
import { loginGithub } from "@/api/github";
import { login } from "@/api/auth";
import { responseSchema } from "@/api/schemas/response_schema";
import { EyeIcon, EyeOffIcon } from "../../../public/svgs/eyeIcon";
import axios from "axios";
import { GithubIcon } from "../../../public/svgs/githubIcon";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response: responseSchema = await login({ email, password })

      if (response.status != 200) {
        throw new Error(response.error || response.message || "Login failed");
      }

      localStorage.setItem("access_token", response.data.access_token);

      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to create account");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyles =
    "w-full border-b border-zinc-700 bg-transparent px-2 py-1.5 text-md caret-white text-white outline-none transition-colors focus:border-white autofill:bg-transparent [:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [:-webkit-autofill]:[-webkit-text-fill-color:white]";

  return (
    <main
      className={`${inter.className} flex min-h-screen items-center justify-center bg-[#121212] px-4 py-20`}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>

          <p className="mb-8 text-sm text-zinc-400">
            Sign in to pick up where you left off with your repos
          </p>
        </motion.div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Email
            </label>

            <motion.input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyles}
              required
              whileFocus={{
                scale: 1.01,
                transition: {
                  duration: 0.2,
                },
              }}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Password
            </label>

            <div className="relative">
              <motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputStyles} pr-10`}
                required
                whileFocus={{
                  scale: 1.01,
                  transition: {
                    duration: 0.2,
                  },
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{
                opacity: 0,
                y: -6,
                height: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              role="alert"
              className="text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          {/* Login button */}
          <motion.button
            variants={itemVariants}
            whileHover={{
              scale: 1.015,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            whileTap={{
              scale: 0.985,
            }}
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-md bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <motion.span
              key={loading ? "loading" : "login"}
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.span>
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="my-8 flex items-center gap-3"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: "easeOut",
            }}
            className="h-px flex-1 origin-right bg-zinc-800"
          />

          <span className="text-xs uppercase tracking-wide text-zinc-500">
            or
          </span>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: "easeOut",
            }}
            className="h-px flex-1 origin-left bg-zinc-800"
          />
        </motion.div>

        {/* GitHub */}
        <motion.button
          variants={itemVariants}
          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.985,
          }}
          type="button"
          onClick={loginGithub}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
        >
          <motion.span
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <GithubIcon className="h-4 w-4" />
          </motion.span>

          Continue with GitHub
        </motion.button>

        {/* Register */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-center text-sm text-zinc-500"
        >
          Don&apos;t have an account?{" "}
          <motion.a
            href="/register"
            whileHover={{
              x: 2,
            }}
            transition={{
              duration: 0.15,
            }}
            className="inline-block font-medium text-zinc-300 underline underline-offset-4 transition-colors hover:text-white"
          >
            Register
          </motion.a>
        </motion.p>
      </motion.div>
    </main>
  );
}