const asyncCatch = require('../utils/asyncCatch')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const ProductModel = require('../models/ProductModel')


exports.getProduct = factory.getOne(ProductModel);
exports.updateProduct = factory.updateOne(ProductModel);
exports.getAllProducts = factory.getAll(ProductModel);
exports.createProduct = factory.createOne(ProductModel);
exports.deleteProduct = factory.deleteOne(ProductModel);