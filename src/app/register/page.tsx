"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { loginGithub } from "@/api/github";
import { responseSchema } from "@/api/schemas/response_schema";
import { register } from "@/api/auth";
import { passwordRules, isPasswordValid } from "@/lib/validatePassword";
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

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordMeetsRules = isPasswordValid(password);
  const showChecklist = passwordTouched && !passwordMeetsRules;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      setPasswordTouched(true);
      setError("Password doesn't meet the requirements below.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response: responseSchema = await register({ email, password });
      console.log(response)

      if (response.status != 200) {
        throw new Error(response.message || "Failed to create account");
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
            Turn code into conversation
          </h1>

          <p className="mb-8 text-sm text-zinc-400">
            Create your account to unlock instant codebase insights
          </p>
        </motion.div>

        {/* Form */}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!passwordTouched) setPasswordTouched(true);
                }}
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

            <AnimatePresence>
              {showChecklist && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mt-2 space-y-1 overflow-hidden text-xs"
                >
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className={
                          passed
                            ? "text-emerald-400 transition-colors"
                            : "text-zinc-500 transition-colors"
                        }
                      >
                        {passed ? "✓" : "○"} {rule.label}
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
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

          {/* Register button */}
          <motion.button
            variants={itemVariants}
            whileHover={
              isPasswordValid(password) ? {
                scale: 1.015,
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              } : {}}
            whileTap={{
              scale: 0.985,
            }}
            type="submit"
            disabled={loading || !isPasswordValid(password)}
            className="w-full cursor-pointer rounded-md bg-white disabled:cursor-auto py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:bg-[#212121]"
          >
            <motion.span
              key={loading ? "loading" : "register"}
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
              {loading ? "Creating account..." : "Create account"}
            </motion.span>
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="my-8 flex items-center gap-3"
        >
          <span className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs uppercase tracking-wide text-zinc-500">
            or
          </span>
          <span className="h-px flex-1 bg-zinc-800" />
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
          <GithubIcon className="h-4 w-4" />
          Continue with GitHub
        </motion.button>

        {/* Login link */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-center text-sm text-zinc-500"
        >
          Already have an account?{" "}
          <motion.span
            whileHover={{
              x: 2,
            }}
            transition={{
              duration: 0.15,
            }}
            className="inline-block"
          >
            <Link
              href="/login"
              className="font-medium text-zinc-300 underline underline-offset-4 transition-colors hover:text-white"
            >
              Login
            </Link>
          </motion.span>
        </motion.p>
      </motion.div>
    </main>
  );
}