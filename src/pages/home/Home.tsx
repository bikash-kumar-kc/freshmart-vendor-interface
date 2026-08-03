import { FARM_PHOTO_URL } from "@/lib/constants/constant";
import { container, item } from "@/lib/motion/motion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="w-full  relative min-h-screen overflow-hidden font-sans">
      <motion.img
        src={FARM_PHOTO_URL}
        alt="Organic farm"
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-x-0 top-0 z-20"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌿</span>

              <h2 className="text-2xl font-semibold tracking-wider text-white">
                FreshMart
              </h2>
            </div>
          </Link>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-md border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              Login
            </motion.button>
          </Link>
        </div>
      </motion.header>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-center"
        >
          <motion.p
            variants={item}
            className="text-sm font-medium uppercase tracking-widest text-white/70"
          >
            For Farmers & Suppliers
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
          >
            Your harvest deserves
            <br />a wider market.
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-8 max-w-2xl text-md leading-6 text-white/80"
          >
            Every crop represents months of dedication. FreshMart helps you
            connect directly with customers who value fresh, organic produce.
            List your products, receive orders, and grow your business—all in
            one place.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/vendor-registration">
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-md bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-green-700"
              >
                Become a Vendor
              </motion.button>
            </Link>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="rounded-md border border-white/30 bg-white/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm hover:bg-white/20"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
