const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Product = require('./../models/productModel');
const User = require('./../models/userModel');

// const APIFeatures = require("./../utils/apiFeature");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadProductPhoto = upload.single("image");

// exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `product-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/products/${req.file.filename}`);

//   next();
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'model/gltf-binary') {
    cb(null, true);
  } else {
    cb(
      new AppError('Not a .glb file! Please upload only .glb files.', 400),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductFile = upload.single('image'); // Expecting field named 'image'

exports.saveProductFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded!', 400));

  const fileExtension = path.extname(req.file.originalname);
  req.file.filename = `product-${req.user.id}-${Date.now()}${fileExtension}`;

  // Ensure the directory exists
  const uploadPath = path.join(__dirname, '../public/img/products');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Save the .glb file directly
  const filePath = path.join(uploadPath, req.file.filename);
  fs.writeFileSync(filePath, req.file.buffer);

  // Attach the filename to req.body for the next middleware
  req.body.image = req.file.filename;

  next();
});

exports.createProduct = catchAsync(async (req, res, next) => {
  // if (!req.body.image) req.body.image = "default.jpg"; // Ensure there's a default image if none was uploaded

  req.body.user = req.user._id;

  const newProduct = await Product.create(req.body);

  // Updating AssociatedUser
  const user = await User.findById(req.user.id);
  // user.associatedPersons.push(newProduct._id); // Uncomment if needed
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  // CREATING INSTANCE
  // const features = new APIFeatures(Person.find(), req.query);
  // features.filter().sort().limitFields().paginate();

  // EXECUTE QUERY
  // const persons = await features.query;

  const products = await Product.find();
  res.status(200).json({
    status: 'success',
    result: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = async (req, res, next) => {
  try {
    // const person = await Person.findOne({ _id: req.params.id });
    // const tour = await Tour.findById(req.params.id).populate('guides');

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('No product found with that id', 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
    // 204 means no content
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
