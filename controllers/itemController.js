const db = require('../db/pool');

exports.itemDetailGet = async (req, res, next) => {
	try {
		const itemId = req.params.id;
		const { rows } = await db.query('SELECT * FROM items WHERE id = $1', [
			itemId,
		]);
		if (rows.length === 0) {
			return res.status(404).render('error', { message: 'Item not found' });
		}

		res.render('item_detail', { title: rows[0].name, item: rows[0] });
	} catch (err) {
		next(err);
	}
};

exports.itemCreateGet = async (req, res, next) => {
	try {
		const { rows: categories } = await db.query(
			'SELECT * FROM categories ORDER BY name ASC',
		);
		res.render('item_form', {
			title: 'Create New Item',
			item: null,
			categories,
		});
	} catch (err) {
		next(err);
	}
};

exports.itemCreatePost = async (req, res, next) => {
	try {
		const { name, description, price, stock_count, category_id } = req.body;
		await db.query(
			`
			INSERT INTO items (name, description, price, stock_count, category_id)
			VALUES ($1, $2, $3, $4, $5)`,
			[name, description, price, stock_count, category_id],
		);
		res.redirect(`/category/${category_id}`);
	} catch (err) {
		next(err);
	}
};

exports.itemUpdateGet = async (req, res, next) => {
	try {
		const itemId = req.params.id;
		const itemQuery = db.query('SELECT * FROM items WHERE id = $1', [itemId]);
		const categoriesQuery = db.query(
			'SELECT * FROM categories ORDER BY name ASC',
		);
		const [itemResult, categoriesResult] = await Promise.all([
			itemQuery,
			categoriesQuery,
		]);

		if (itemResult.rows.length === 0) {
			return res.status(404).render('error', { message: 'Item not found' });
		}

		res.render('item_form', {
			title: 'Update Item',
			item: itemResult.rows[0],
			categories: categoriesResult.rows,
		});
	} catch (err) {
		next(err);
	}
};

exports.itemUpdatePost = async (req, res, next) => {
	try {
		const itemId = req.params.id;
		const {
			name,
			description,
			price,
			stock_count,
			category_id,
			admin_password,
		} = req.body;
		if (admin_password !== process.env.ADMIN_SECRET) {
			const { rows: categories } = await db.query(
				'SELECT * FROM categories ORDER BY name ASC',
			);
			return res.status(403).render('item_form', {
				title: 'Update Item',
				item: {
					id: itemId,
					name,
					description,
					price,
					stock_count,
					category_id,
				},
				categories,
				errorMessage: 'Incorrect admin password!',
			});
		}
		await db.query(
			`UPDATE items SET name = $1, description = $2, price = $3, stock_count = $4, category_id = $5 WHERE id = $6`,
			[name, description, price, stock_count, category_id, itemId],
		);
		res.redirect(`/item/${itemId}`);
	} catch (err) {
		next(err);
	}
};

exports.itemDeletePost = async (req, res, next) => {
	try {
		const itemId = req.params.id
		const { admin_password } = req.body;
		if (admin_password !== process.env.ADMIN_SECRET) {
			return res.status(403).send('Access Denied: Incorrect Admin Password');
		}

		await db.query('DELETE FROM items WHERE id = $1', [itemId]);
		res.redirect('/');
	} catch (err) {
		next(err);
	}
};
