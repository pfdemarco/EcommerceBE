const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagVal = await Tag.findAll({
      attributes: ['id', 'tag_name'],
      include: [{ model: Product }],
    })
    res.status(200).json(tagVal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data

router.get('/:id', async (req, res) => {
  try {
    const tagVal = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagVal) {
      res.status(404).json
      ({ message: 'Sorry, no tag found matching our records, try again' });
      return;
    }

    res.status(200).json(tagVal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new tag

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err)
  }
});

// update a tag's name by its `id` value

router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, {

      where: {
        id: req.params.id
      }
    }).then(updateTag)
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete on tag by its `id` value

router.delete('/:id', async (req, res) => {
  try {
    const destroyTag = await Tag.destroy(
      {
        where: {
          id: req.params.id
        }
      }).then(destroyTag => (destroyTag) ? res.status(200).json : res.status(404).json
        ({ message: 'You cant destroy something that is NOT there!' }));
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
// const router = require('express').Router();
// const { Tag, Product, ProductTag } = require('../../models');

// // The `/api/tags` endpoint

// router.get('/', (req, res) => {
//   // find all tags
//   // be sure to include its associated Product data
// });

// router.get('/:id', (req, res) => {
//   // find a single tag by its `id`
//   // be sure to include its associated Product data
// });

// router.post('/', (req, res) => {
//   // create a new tag
// });

// router.put('/:id', (req, res) => {
//   // update a tag's name by its `id` value
// });

// router.delete('/:id', (req, res) => {
//   // delete on tag by its `id` value
// });

// module.exports = router;
