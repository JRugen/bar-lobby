import vue from "@vitejs/plugin-vue";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import path from "path";
import VueRouter from "unplugin-vue-router/vite";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
    main: {
        resolve: {
            alias: {
                "@": path.join(__dirname, "src/main"),
                $: path.join(__dirname, "src/common"),
            },
        },
        build: {
            assetsDir: ".",
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("env-paths")) {
                            return "env-paths";
                        }
                        return;
                    },
                },
            },
        },
        plugins: [externalizeDepsPlugin({ exclude: ["env-paths"] })],
    },
    renderer: {
        resolve: {
            alias: {
                "@": path.join(__dirname, "src/renderer"),
                $: path.join(__dirname, "src/common"),
            },
        },
        build: {
            assetsDir: ".",
            rollupOptions: {
                external: ["better-sqlite3"],
            },
            sourcemap: true,
        },
        optimizeDeps: {
            esbuildOptions: {
                target: "esnext",
            },
        },
        css: {
            modules: false,
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/styles/_utils.scss";`,
                },
            },
        },
        plugins: [
            VueRouter({
                routesFolder: "src/renderer/views",
                dts: "src/renderer/typed-router.d.ts",
                importMode: "sync",
            }),
            vue(),
            renderer({
                nodeIntegration: true,
            }),
        ],
    },
});
