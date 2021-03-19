const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
// find all products
// be sure to include its associated Category and Tag data

router.get('/', async (req, res) => {
  try {
    const productVal = await Product.findAll({
      attributes: ['id', 'product_name'],
      include: [
        { model: Category },
        { model: Tag }
      ],
    })
    res.status(200).json(productVal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
// find a single product by its `id`
// be sure to include its associated Category and Tag data

router.get('/:id', async (req, res) => {
  try {
    const productVal = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag }
      ],
    });

    if (!productVal) {
      res.status(404).json
      ({ message: 'Sorry, no product found matching our records, try again' });
      return;
    }

    res.status(200).json(productVal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  const tagIds = req.body.tagIds || [];
  try {
    const productVal = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    })
    console.log(tagIds)
    if (tagIds.length) {
      console.log(typeof tagIds)
      const productTagIdArr = tagIds.map((tag_id) => {
        return {
          product_id: productVal.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      console.log(productTagIds);
     
    }
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      // if no product tags, just respond
      productVal.getTags();
      res.status(200).json(productVal);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    };
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value

router.delete('/:id', async (req, res) => {
  try {
    const destroyProduct = await Product.destroy(
      {
        where: {
          id: req.params.id
        }
      }).then(destroyProduct => (destroyProduct) ? res.status(200).json : res.status(404).json
        ({ message: 'You cant destroy something that is NOT there!' }));
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
// const router = require('express').Router();
// const { Product, Category, Tag, ProductTag } = require('../../models');

// // The `/api/products` endpoint

// // get all products
// router.get('/', (req, res) => {
//   // find all products
//   // be sure to include its associated Category and Tag data
// });

// // get one product
// router.get('/:id', (req, res) => {
//   // find a single product by its `id`
//   // be sure to include its associated Category and Tag data
// });

// // create new product
// router.post('/', (req, res) => {
//   /* req.body should look like this...
//     {
//       product_name: "Basketball",
//       price: 200.00,
//       stock: 3,
//       tagIds: [1, 2, 3, 4]
//     }
//   */
//   Product.create(req.body)
//     .then((product) => {
//       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
//       if (req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       // if no product tags, just respond
//       res.status(200).json(product);
//     })
//     .then((productTagIds) => res.status(200).json(productTagIds))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// // update product
// router.put('/:id', (req, res) => {
//   // update product data
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       // find all associated tags from ProductTag
//       return ProductTag.findAll({ where: { product_id: req.params.id } });
//     })
//     .then((productTags) => {
//       // get list of current tag_ids
//       const productTagIds = productTags.map(({ tag_id }) => tag_id);
//       // create filtered list of new tag_ids
//       const newProductTags = req.body.tagIds
//         .filter((tag_id) => !productTagIds.includes(tag_id))
//         .map((tag_id) => {
//           return {
//             product_id: req.params.id,
//             tag_id,
//           };
//         });
//       // figure out which ones to remove
//       const productTagsToRemove = productTags
//         .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//         .map(({ id }) => id);

//       // run both actions
//       return Promise.all([
//         ProductTag.destroy({ where: { id: productTagsToRemove } }),
//         ProductTag.bulkCreate(newProductTags),
//       ]);
//     })
//     .then((updatedProductTags) => res.json(updatedProductTags))
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

// router.delete('/:id', (req, res) => {
//   // delete one product by its `id` value
// });

// module.exports = router;
