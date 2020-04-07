const { override, fixBabelImports, addLessLoader, addBundleVisualizer, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@body-background': '#000',
      '@component-background': '#27272B',
      '@layout-header-background': '#27272B',
      '@layout-body-background ': '#27272B',
      '@layout-sider-background': '#27272B',
      '@layout-content-background': '#303035',
      '@text-color': '#FFF',
      '@border-color-split': '#333',
      '@item-active-bg': '#1B1C28',
      '@item-hover-bg': '#1B1C28',
      '@text-color-secondary': '#fff',
      '@background-color-light': '#1B1C28',
      '@disabled-color': '#ccc',
      '@icon-url': '"~antd-iconfont/iconfont"'
    },
  }),
  addWebpackModuleRule(
    {
      test: /\.worker\.js$/,
      use: [
        {
          loader: 'worker-loader',
          options: {
            name: 'static/js/[hash].[ext]',
          },
        }
      ]
    }
  ),
  process.env.USE_ANALYZER && addBundleVisualizer(),
);
