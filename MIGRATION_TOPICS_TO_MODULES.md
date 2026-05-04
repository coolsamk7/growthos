# Migration Guide: Topics to Modules

## Problem
Topics were created without a `user_module_id` field, so they're not properly filtered by module. This causes all topics to show up in all modules.

## Solution Steps

### 1. Restart the API Server
First, ensure the API server is running so TypeORM can create the new database column:

```bash
cd /home/sameer/projects/growthos
yarn workspace @growthos/api dev
```

Wait for the message: "Application is running on..."

The API will automatically create the `user_module_id` column in the `user_topics` table.

### 2. Run the Migration Script

After the API starts and creates the column, run the migration script:

```bash
cd /home/sameer/projects/growthos
yarn workspace @growthos/api migrate:topics
```

### What the Script Does

The migration script will:

1. ✅ Find all topics without a `user_module_id`
2. ✅ Group them by `user_learning_path_id`
3. ✅ For each learning path:
   - Create an "Uncategorized Topics" module (if it doesn't exist)
   - Assign all orphaned topics to this module
4. ✅ Report the results

### Example Output

```
📦 Connecting to database...
✅ Connected to database

📊 Found 15 topics without a module assignment

🔄 Processing topics by learning path...

📚 Learning Path: abc123...
   Topics to migrate: 8
   📝 Creating "Uncategorized Topics" module...
   ✅ Created module: xyz789...
      ✓ Assigned topic "Arrays" to module
      ✓ Assigned topic "Strings" to module
      ...
   ✅ Migrated 8 topics

📚 Learning Path: def456...
   Topics to migrate: 7
   ✅ Using existing module: uvw987...
      ✓ Assigned topic "Trees" to module
      ...
   ✅ Migrated 7 topics

✨ Migration completed successfully!

📋 Summary:
   - Topics migrated: 15
   - Learning paths affected: 2

💡 Note: Topics have been assigned to "Uncategorized Topics" modules.
   You can move them to other modules via the UI if needed.
```

### 3. Refresh Your Browser

After running the migration:
1. Refresh your web browser
2. Navigate to your learning paths
3. Each module should now show only its own topics
4. You'll see an "Uncategorized Topics" module containing your old topics

### 4. Organize Your Topics

You can now:
- Create new, properly organized modules
- Add topics directly to the correct modules
- Or manually reassign topics from "Uncategorized Topics" to other modules (you'll need to build this UI feature)

## Troubleshooting

### "Column user_module_id doesn't exist"
- Make sure the API server has started at least once after the code changes
- Check the API logs for any TypeORM synchronization errors

### "No topics found"
- Good news! All your topics are already assigned to modules
- Or you don't have any topics yet

### Script Errors
- Check that DATABASE_* environment variables are set in `apps/api/.env`
- Ensure PostgreSQL is running
- Verify database credentials

## Future Topics

All new topics created after this migration will automatically:
- Be assigned to the module you create them in
- Show up only in their assigned module
- Be properly filtered and paginated

## Notes

- The migration is **idempotent** - you can run it multiple times safely
- It only affects topics where `user_module_id IS NULL`
- Already assigned topics won't be touched
- The "Uncategorized Topics" module uses `orderIndex: 999` to appear at the end
