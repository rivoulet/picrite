import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
    plugins: [react(), svgr()],
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
        alias: {
            "src": path.resolve(__dirname, "src"),
        }
    }
});
