/**
 * @func load modules dynamically
 */
import configs from '../config.json';
import * as importModules from '../require';

let modules = {};
configs.modules.forEach((m) => {
  m.items.forEach((n) => {
    modules[n] = importModules[n];
  });
});

export default {
  configs: configs,
  modules: modules
};
