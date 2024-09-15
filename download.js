// Function to search for unique href values and titles within the table, download files sequentially, and export links and BAT file
async function generateAndDownloadFilesSequentially() {
    // Select the table with class 'pastelist'
    const pastelistTable = document.querySelector('table.pastelist');
    
    if (!pastelistTable) {
        console.log('No table with class "pastelist" found.');
        return;
    }
    
    // Select all <a> tags within the table
    const links = pastelistTable.querySelectorAll('a[href^="/"]');
    
    // Base URL for the download link
    const baseUrl = "https://paste.fo/raw";
    
    // Arrays to hold result links and BAT file commands
    const resultLinks = [];
    const batCommands = [];

    // Function to download a file
    async function downloadFile(downloadLink, identifier) {
        try {
            const response = await fetch(downloadLink);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${downloadLink}`);
            }
            const blob = await response.blob();
            
            // Create a link element for downloading
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = identifier;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        }
    }

    for (const link of links) {
        // Extract the href value
        const hrefValue = link.getAttribute('href');
        // Extract the title text
        const title = link.textContent.trim();
        
        // Skip links containing "rank", "changelog", "user", or "scamwarning"
        if (hrefValue.includes("rank") || 
            hrefValue.includes("changelog") || 
            hrefValue.includes("user") || 
            hrefValue.includes("scamwarning")) {
            continue;
        }
        
        // Extract the unique identifier (assuming it's everything after the first slash)
        const identifier = hrefValue.split('/')[1];
        
        // Construct the download link
        const downloadLink = `${baseUrl}/${identifier}?download`;
        resultLinks.push(downloadLink);
        
        // Add BAT file command to rename file
        batCommands.push(`ren "${identifier}.txt" "${title}_${identifier}.txt"`);
        
        console.log(`Generated download link: ${downloadLink}`);
        
        // Download the file
        await downloadFile(downloadLink, identifier + '.txt');
    }

    // Create a Blob for the result links
    const textBlob = new Blob([resultLinks.join('\n')], { type: 'text/plain' });
    
    // Create a link element for the result file
    const resultLink = document.createElement('a');
    resultLink.href = URL.createObjectURL(textBlob);
    resultLink.download = 'download-links.txt';
    document.body.appendChild(resultLink);
    resultLink.click();
    document.body.removeChild(resultLink);

    // Create a Blob for the BAT file
    const batBlob = new Blob([batCommands.join('\n')], { type: 'text/plain' });
    
    // Create a link element for the BAT file
    const batFileLink = document.createElement('a');
    batFileLink.href = URL.createObjectURL(batBlob);
    batFileLink.download = 'rename-files.bat';
    document.body.appendChild(batFileLink);
    batFileLink.click();
    document.body.removeChild(batFileLink);
}

// Run the function to generate and download files sequentially
generateAndDownloadFilesSequentially();
