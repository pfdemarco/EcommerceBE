const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryVal = await Category.findAll({
      attributes: ['id', 'category_name'],
      include: [{ model: Product }],
    })
    res.status(200).json(categoryVal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its `id` value
// be sure to include its associated Products

router.get('/:id', async (req, res) => {
  try {
    const categoryVal = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryVal) {
      res.status(404).json
      ({ message: 'Sorry, no category found matching our records, try again' });
      return;
    }

    res.status(200).json(categoryVal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new category

router.post('/', async (req, res) => {
  console.log('RES: ' + res);
  console.log('RES: ' + req);
  try {
    const newCategory = await Category.create(req.body)
    console.log(newCategory);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err)
  }
});

// update a category by its `id` value

router.put('/:id', async (req, res) => {
  try {
    const updateCategory = await Category.update(req.body, {

      where: {
        id: req.params.id
      }
    }).then(updateCategory)
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a category by its `id` value

router.delete('/:id', async (req, res) => {
  try {
    const destroyCategory = await Category.destroy(
      {
        where: {
          id: req.params.id
        }
      }).then(destroyCategory => (destroyCategory) ? res.status(200).json : res.status(404).json
        ({ message: 'You cant destroy something that is NOT there!' }));
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;


// const router = require('express').Router();
// const { Category, Product } = require('../../models');

// // The `/api/categories` endpoint

// // router.get('/', (req, res) => {
// //   // find all categories
// //   // be sure to include its associated Products
// // });

// router.get('/', async (req, res) => {
//   try {
//     const categoryData = await Category.findAll({
      
//       include: [{ model: Product }],
//     });
//     res.status(200).json(categoryData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get('/:id', (req, res) => {
//   // find one category by its `id` value
//   // be sure to include its associated Products
// });

// router.post('/', (req, res) => {
//   // create a new category
// });

// router.put('/:id', (req, res) => {
//   // update a category by its `id` value
// });

// router.delete('/:id', (req, res) => {
//   // delete a category by its `id` value
// });

// module.exports = router;






// // const router = require('express').Router();
// // // Include the Book model with the other imports
// // const { Reader, Book, LibraryCard } = require('../../models');

// // // GET all readers
// // router.get('/', async (req, res) => {
// //   try {
// //     const readerData = await Reader.findAll({
// //       // Add Book as a second model to JOIN with
// //       include: [{ model: LibraryCard }, { model: Book }],
// //     });
// //     res.status(200).json(readerData);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// // // GET a single reader
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const readerData = await Reader.findByPk(req.params.id, {
// //       // Add Book as a second model to JOIN with
// //       include: [{ model: LibraryCard }, { model: Book }],
// //     });

// //     if (!readerData) {
// //       res.status(404).json({ message: 'No reader found with that id!' });
// //       return;
// //     }

// //     res.status(200).json(readerData);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// // // CREATE a reader
// // router.post('/', async (req, res) => {
// //   try {
// //     const readerData = await Reader.create(req.body);
// //     res.status(200).json(readerData);
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // });

// // // DELETE a reader
// // router.delete('/:id', async (req, res) => {
// //   try {
// //     const readerData = await Reader.destroy({
// //       where: {
// //         id: req.params.id,
// //       },
// //     });

// //     if (!readerData) {
// //       res.status(404).json({ message: 'No reader found with that id!' });
// //       return;
// //     }

// //     res.status(200).json(readerData);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// // module.exports = router;
