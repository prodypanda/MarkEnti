const DesignConfig = require('../models/designConfig.model')

exports.getDesignConfig = async (req, res) => {
  const { id } = req.params
  const designConfig = await DesignConfig.findOne({ user: id })
  res.json(designConfig || {})
}

// exports.updateDesignConfig = async (req, res) => {
//   const { id } = req.params;
//   const { theme, customCSS, fonts, colors } = req.body;
//   let designConfig = await DesignConfig.findOneAndUpdate(
//     { user: id },
//     {
//       theme,
//       customCSS,
//       fonts,
//       colors
//       // INPUT_REQUIRED {Add additional properties here}
//     },
//     { new: true, upsert: true }
//   );
//   res.json(designConfig);
// };

exports.updateDesignConfig = async (req, res) => {
  const { id } = req.params
  const {
    theme,
    customCSS,
    colors,
    layout,
    logo,
    favicon,
    backgroundImage,
    socialMediaLinks,
    typography,
    breakpoints,
    spacing,
    border,
  } = req.body

  // Ideally, validation of input data should be performed here before updating

  try {
    let designConfig = await DesignConfig.findOneAndUpdate(
      { user: id },
      {
        ...(theme && { theme }),
        ...(customCSS && { customCSS }),
        ...(colors && { colors }),
        ...(layout && { layout }),
        ...(logo && { logo }),
        ...(favicon && { favicon }),
        ...(backgroundImage && { backgroundImage }),
        ...(socialMediaLinks && { socialMediaLinks }),
        ...(typography && { typography }),
        ...(breakpoints && { breakpoints }),
        ...(spacing && { spacing }),
        ...(border && { border }),
        // Add other properties that should be updated here as needed.
      },
      { new: true, upsert: true, runValidators: true, context: 'query' }
    )

    res.json(designConfig)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
