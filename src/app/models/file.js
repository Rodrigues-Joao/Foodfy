const { FileSystemLoader } = require('nunjucks')
const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(filename, path) {
        const query = `
            INSERT INTO files (
                name,
                path
                ) VALUES ($1,$2) 
                RETURNING id
                `

        const values = [
            filename,
            path
        ]
        return db.query(query, values)
    },
    find(id) {
        const query = `
            SELECT * FROM files WHERE id=$1
        `
        try {
            return db.query(query, [id])
        } catch (err) {
            console.error(err)
        }
    },
    findPhotos(files_id) {

        const query = `
            SELECT * FROM files WHERE id IN (${files_id})
        `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id=$1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)
            return db.query(`DELETE FROM files WHERE id=$1`, [id])

        } catch (err) {

            console.error("ERR " + err)
        }

    }
}