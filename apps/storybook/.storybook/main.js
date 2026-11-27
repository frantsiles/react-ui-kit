import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [getAbsolutePath("@storybook/addon-docs"), getAbsolutePath("@storybook/addon-a11y")],
};

export default config;

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
