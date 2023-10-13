I have implemented the following
    1.  To create a new table if the table doesnot exists in the DB and exists in the sample schema
    2.  To ADD or REMOVE columns in the DB to match the sample schema if a NEW TABLE IS NOT CREATED
    3.  To ADD or REMOVE constraints "NOT NULL" and "PRIMARY KEY" as per the changes in the schema if a 
        NEW TABLE IS NOT CREATED
    4.  Implemented API's for 
        4.1.    Selecting all rows in the TABLE (get("/:collection"))
        4.2.    Selecting a specific row in the TABLE (get("/:collection/:id"))
        4.3.    Inserting a new ENTRY into the TABLE (post("/:collection")) where the values 
                are passed as below in the body
                {data:"id1,value2,value3,..."}
        4.4     Updating a speccific row in the TABLE (post("/:collecction/:id")) where the values
                are passed as below in the body
                {data:[{"name":"column1", "value":"value1"},{"name":"column2", "value":"value2"},...]}
        4.5     Deleting a specific row in the TABLE (delete("/:collection/:id")) 