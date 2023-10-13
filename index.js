const dotenv = require("dotenv").config();
const tablesschema = require("./tables/tableschema.json");
const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const tables = tablesschema.tables;
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
function querybuild(table,i) {
  let qry = table.schema[i].name + " " + table.schema[i].type;
  let attrib = "";
  for (let j = 0; j < table.schema[i].attributes.length; j++) {
    attrib = attrib + table.schema[i].attributes[j] + " ";
  }
  if (table.schema[i].attributes.length) {
    qry = qry + " " + attrib;
  }
  return qry;
}
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database connected");
    tables.map((table) => {
      connection.query(
        `CREATE TABLE IF NOT EXISTS ${table.tablename}(${table.schema.map(
          (cols) => {
            if (!cols.foreignkey) {
              let qry = cols.name + " " + cols.type;
              let attrib = "";
              for (let i = 0; i < cols.attributes.length; i++) {
                attrib = attrib + cols.attributes[i] + " ";
              }
              if (cols.attributes.length) {
                qry = qry + " " + attrib;
              }
              return qry;
            } else {
              return cols.foreignkey;
            }
          }
        )})`,
        (err, rows, fields) => {
          if (err) {
            console.log(err);
          } else {
            if (rows.affectedRows === 0) {
              connection.query(
                `describe samespace.${table.tablename}`,
                (erro, row, field) => {
                  if (erro) {
                    console.log(erro);
                  } else {
                    let rowset = new Set();
                    let schemaset = new Set();
                    for (let i = 0; i < row.length; i++) {
                      rowset.add(row[i].Field);
                    }
                    for (let i = 0; i < table.schema.length; i++) {
                      schemaset.add(table.schema[i].name);
                    }
                    for (let i = 0; i < row.length; i++) {
                      if (!schemaset.has(row[i].Field)) {
                        connection.query(
                          `ALTER TABLE ${table.tablename} DROP COLUMN ${row[i].Feild};`,
                          (error, rowss, feildss) => {
                            if (error) {
                              console.log(error);
                            } else {
                              console.log(rowss);
                            }
                          }
                        );
                      }
                    }
                    for (let i = 0; i < table.schema.length; i++) {
                      if (!rowset.has(table.schema[i].name)) {
                        let qry =querybuild(table,i);
                        console.log(qry);
                        connection.query(
                          `ALTER TABLE ${table.tablename} ADD ${qry} `,
                          (error, rowss, feildss) => {
                            if (error) {
                              console.log(error);
                            } else {
                              console.log(rowss);
                            }
                          }
                        );
                      } else {
                        let attrset = new Set();
                        for (
                          let k = 0;
                          k < table.schema[i].attributes.length;
                          k++
                        ) {
                          attrset.add(table.schema[i].attributes[k]);
                        }
                        for (let j = 0; j < row.length; j++) {
                          if (row[j].Field === table.schema[i].name) {
                            if (attrset.has("NOT NULL")) {
                              if (row[j].Null) {
                                let qry =querybuild(table,i);
                                connection.query(
                                  `ALTER TABLE ${table.tablename} MODIFY COLUMN ${qry}`,
                                  (error, rowss, feildss) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log(rowss);
                                    }
                                  }
                                );
                              }
                            } else {
                              if (!row[j].Null) {
                                let qry =querybuild(table,i);
                                connection.query(
                                  `ALTER TABLE ${table.tablename} MODIFY COLUMN ${qry}`,
                                  (error, rowss, feildss) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log(rowss);
                                    }
                                  }
                                );
                              }
                            }

                            if (attrset.has("PRIMARY KEY")) {
                              if (!row[j].Key) {
                                let qry =querybuild(table,i);
                                connection.query(
                                  `ALTER TABLE ${table.tablename} MODIFY COLUMN ${qry}`,
                                  (error, rowss, feildss) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log(rowss);
                                    }
                                  }
                                );
                              }
                            } else {
                              if (row[j].Key) {
                                let qry =querybuild(table,i);
                                connection.query(
                                  `ALTER TABLE ${table.tablename} MODIFY COLUMN ${qry}`,
                                  (error, rowss, feildss) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log(rowss);
                                    }
                                  }
                                );
                              }
                            }
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              );
            }
          }
        }
      );
    });
  }
});

app.post("/:collection");

app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
