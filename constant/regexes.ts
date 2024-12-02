export default {
  class: /class=['"][^'"]*['"]/gm, // classname detector
  width: /(?<=\s)width=['"][^'"]*['"]/gm, // width attribute detector
  height: /(?<=\s)height=['"][^'"]*['"]/gm, // height attribute detector
  stroke: /stroke=['"][^'"]*['"]/gm, // stroke attribute detector
  fill: /fill=['"][^'"]*['"]/gm, // fill attribute detector
};
