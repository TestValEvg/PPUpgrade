import re

# Fix both test files - replace Escape with clicking dropdown label again
files = [
    r'PPUpgradeTests\Tests\navigator.quarterly-update.download.spec.ts',
    r'PPUpgradeTests\Tests\navigator.quarterly-update.spec.ts'
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8', newline='') as f:
        content = f.read()
    
    # Replace Escape keypress with clicking dropdown again to close it (handle both \r\n and \n)
    content = re.sub(
        r"await newPage\.keyboard\.press\('Escape'\);\r?\n        await newPage\.waitForTimeout\(1000\);\r?\n        console\.log\('✓ Jurisdictions dropdown closed'\);",
        "// Close dropdown by clicking the label again\r\n        await jurisdictionsDropdown.click();\r\n        await newPage.waitForTimeout(500);\r\n        console.log('✓ Jurisdictions dropdown closed');",
        content
    )
    
    # Also handle the 500ms variant
    content = re.sub(
        r"await newPage\.keyboard\.press\('Escape'\);\r?\n        await newPage\.waitForTimeout\(500\);",
        "// Close dropdown by clicking the label again\r\n        await jurisdictionsDropdown.click();\r\n        await newPage.waitForTimeout(500);",
        content
    )
    
    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    
    print(f"✓ Fixed {file_path}")

print("\nDone!")

