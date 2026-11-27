import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import remarkGfm from "remark-gfm";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: getAbsolutePath("@storybook/addon-docs"),
      options: {
        // MDX no trae las extensiones de GitHub (tablas, tachado, listas de tareas)
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    getAbsolutePath("@storybook/addon-a11y"),
  ],
};

export default config;

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
