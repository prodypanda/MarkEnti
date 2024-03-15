const mongoose = require('mongoose')

/**
 * @swagger
 * components:
 *   schemas:
 *     DesignConfig:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ObjectID of the user this design config belongs to
 *         theme:
 *           type: string
 *           default: 'default'
 *         customCSS:
 *           type: string
 *         colors:
 *           type: object
 *           properties:
 *             primary:
 *               type: string
 *               default: '#333'
 *             secondary:
 *               type: string
 *               default: '#666'
 *             background:
 *               type: string
 *               default: '#fff'
 *             accent:
 *               type: string
 *               default: '#f00'
 *         layout:
 *           type: object
 *           properties:
 *             headerPosition:
 *               type: string
 *               enum: ['top', 'left', 'right', 'bottom']
 *               default: 'top'
 *             menuPosition:
 *               type: string
 *               enum: ['side', 'top']
 *               default: 'top'
 *             sidebarPosition:
 *               type: string
 *               enum: ['left', 'right']
 *               default: 'left'
 *             roundedCorners:
 *               type: boolean
 *               default: true
 *         logo:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               default: 'path/to/default/logo.png'
 *             altText:
 *               type: string
 *               default: 'Company Logo'
 *         favicon:
 *           type: string
 *         backgroundImage:
 *           type: string
 *         socialMediaLinks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *               link:
 *                 type: string
 *               icon:
 *                 type: string
 *         typography:
 *           type: object
 *           properties:
 *             fonts:
 *               type: object
 *               properties:
 *                 header:
 *                   type: string
 *                   default: 'Arial, sans-serif'
 *                 body:
 *                   type: string
 *                   default: 'Georgia, serif'
 *             baseFontSize:
 *               type: string
 *               default: '16px'
 *             headingStyles:
 *               type: object
 *               properties:
 *                 h1:
 *                   type: string
 *                   default: '2em'
 *                 h2:
 *                   type: string
 *                   default: '1.5em'
 *                 h3:
 *                   type: string
 *                   default: '1.17em'
 *                 h4:
 *                   type: string
 *                   default: '1em'
 *                 h5:
 *                   type: string
 *                   default: '.83em'
 *                 h6:
 *                   type: string
 *                   default: '.67em'
 *         breakpoints:
 *           type: object
 *           properties:
 *             xs:
 *               type: string
 *               default: '320px'
 *             sm:
 *               type: string
 *               default: '480px'
 *             md:
 *               type: string
 *               default: '768px'
 *             lg:
 *               type: string
 *               default: '992px'
 *             xl:
 *               type: string
 *               default: '1200px'
 *         spacing:
 *           type: object
 *           properties:
 *             small:
 *               type: string
 *               default: '8px'
 *             medium:
 *               type: string
 *               default: '16px'
 *             large:
 *               type: string
 *               default: '24px'
 *             extraLarge:
 *               type: string
 *               default: '32px'
 *         border:
 *           type: object
 *           properties:
 *             width:
 *               type: string
 *               default: '1px'
 *             style:
 *               type: string
 *               default: 'solid'
 *             color:
 *               type: string
 *               default: '#000'
 */
/**
 * Schema for design configuration settings. Allows customization of theme colors,
 * layout, typography, spacing, etc.
 *
 * @typedef {Object} DesignConfig
 */
const designConfigSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    theme: { type: String, default: 'default' },
    customCSS: { type: String },
    colors: {
      primary: { type: String, default: '#333' }, // Adding default color values
      secondary: { type: String, default: '#666' },
      background: { type: String, default: '#fff' }, // Adding a background color option
      accent: { type: String, default: '#f00' }, // Adding an accent color option
    },
    layout: {
      // Adding layout configuration options
      headerPosition: {
        type: String,
        enum: ['top', 'left', 'right', 'bottom'],
        default: 'top',
      },
      menuPosition: { type: String, enum: ['side', 'top'], default: 'top' },
      sidebarPosition: {
        type: String,
        enum: ['left', 'right'],
        default: 'left',
      },
      roundedCorners: { type: Boolean, default: true }, // Whether elements should have rounded corners
    },
    logo: {
      // Adding logo configuration options
      url: { type: String, default: 'path/to/default/logo.png' },
      altText: { type: String, default: 'Company Logo' },
    },
    favicon: { type: String }, // URL to the favicon image
    backgroundImage: { type: String }, // URL to the background image
    socialMediaLinks: [
      // Array of social media links
      {
        platform: String, // Platform name (e.g. 'Facebook', 'Twitter')
        link: String, // Link to the platform
        icon: String,
      },
    ],
    typography: {
      // Adding typography options
      fonts: {
        header: { type: String, default: 'Arial, sans-serif' }, // Providing a default header font
        body: { type: String, default: 'Georgia, serif' }, // Providing a default body font
      },
      baseFontSize: { type: String, default: '16px' },
      headingStyles: {
        h1: { type: String, default: '2em' },
        h2: { type: String, default: '1.5em' },
        h3: { type: String, default: '1.17em' },
        h4: { type: String, default: '1em' },
        h5: { type: String, default: '.83em' },
        h6: { type: String, default: '.67em' },
      },
    },
    breakpoints: {
      // For responsive design settings
      xs: { type: String, default: '320px' },
      sm: { type: String, default: '480px' },
      md: { type: String, default: '768px' },
      lg: { type: String, default: '992px' },
      xl: { type: String, default: '1200px' },
    },
    spacing: {
      // Adding spacing configuration for margins and padding
      small: { type: String, default: '8px' },
      medium: { type: String, default: '16px' },
      large: { type: String, default: '24px' },
      extraLarge: { type: String, default: '32px' },
    },
    border: {
      // Border styles configuration
      width: { type: String, default: '1px' },
      style: { type: String, default: 'solid' },
      color: { type: String, default: '#000' },
    },
    // FURTHER_CUSTOMIZATION: Add more design configuration options as desired

    // INPUT_REQUIRED {Add other design configurations as needed}
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const DesignConfig = mongoose.model('DesignConfig', designConfigSchema)

module.exports = DesignConfig
