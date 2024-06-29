module.exports = {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  plugins: ["prettier-cp"],
  importOrder: ["lib", "components", "hooks", "types", "utils|helpers", "constants"],
  importOrderSeparation: true,
};
