const db = require('../db/pool');

exports.categoryListGet = async (req, res, next) => {
	try {
		const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC');
		res.render('index', { title: 'Retro Arcade Inventory', categories: rows });
	} catch (err) {
		next(err);
	}
};

exports.categoryDetailGet = async (req, res, next) => {
	try {
		const categoryId = req.params.id;
		const categoryQuery = db.query('SELECT * FROM categories WHERE id = $1', [
			categoryId,
		]);
		const itemsQuery = db.query(
			'SELECT * FROM items WHERE category_id = $1 ORDER BY name ASC',
			[categoryId],
		);

		const [categoryResult, itemsResult] =
			await Promise.all([categoryQuery, itemsQuery])

		if (categoryResult.rows.length === 0) {
			return res.status(404).render('error', { message: 'Category not found' });
		}

		res.render('category_detail', {
			title: categoryResult.rows[0].name,
			category: categoryResult.rows[0],
			items: itemsResult.rows,
		});
	} catch (err) {
		next(err);
	}
};

exports.categoryCreateGet = (req, res) => {
	res.render('category_form', {title: "Create Category", category: null})
}

exports.categoryCreatePost = async (req, res, next) => {
	try {
		const { name, description } = req.body;
		await db.query(
			'INSERT INTO categories (name, description) VALUES ($1, $2)',
			[name, description],
		);
		res.redirect('/');
	} catch (err) {
		next(err)
	}
};

exports.categoryUpdateGet = async (req, res, next) => {
	try {
		const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id])
		if (rows.length === 0) return res.status(404).render('error', {
			message: "Category not found"
		})
		res.render('category_form', {title: "Update Category", category: rows[0]})
	} catch (err) {
		next(err)
	}
}

exports.categoryUpdatePost = async (req, res, next) => {
	try {
		const { name, description, admin_password } = req.body;
		if (admin_password !== process.env.ADMIN_SECRET) {
			return res.status(403).render('category_form', {
				title: "Update Category",
				category: { id: req.params.id, name, description },
				errorMessage: "Incorrect admin password!"
			})
		}
		await db.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [name, description, req.params.id])
		res.redirect(`/category/${req.params.id}`)
	} catch (err) {
		next(err)
	}
}


exports.categoryDeletePost = async (req, res, next) => {
	try {
		const { admin_password } = req.body;
		if (admin_password !== process.env.ADMIN_SECRET) {
			return res.status(403).send("Access Denied: Incorrect Admin Password!")
		}

		await db.query('DELETE FROM categories WHERE id = $1', [req.params.id])
		res.redirect('/')
	} catch (err) {
		next(err)
	}
}