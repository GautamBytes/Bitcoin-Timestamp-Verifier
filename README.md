# Bitcoin Timestamp Verifier

## Overview
The Bitcoin Timestamp Verifier is a web application designed for users to verify the existence of files on the Bitcoin blockchain. This tool utilizes the Blockstream API to facilitate the verification process, ensuring users can check if specific documents or data hashes are recorded on the blockchain.

## Features
- **File Upload**: Users can upload files (PDFs, images, etc.) to generate their respective SHA-256 hash.
- **Blockchain Verification**: The application checks the generated hash against the Bitcoin blockchain using the Blockstream API.
- **User Feedback**: Displays loading states, error messages, and verification results to enhance user experience.
- **Error Handling**: Incorporates error boundaries to catch API failures or network issues, ensuring graceful recovery.

## Technical Stack
- **Frontend**: React.js with Hooks
- **Hashing**: Web Crypto API for SHA-256 computation
- **Networking**: Fetch API for API calls to Blockstream
- **Styling**: CSS for application aesthetics
- **Documentation**: Markdown format for README and code comments

## Installation
1. **Clone the repository**: 
   ```bash
   git clone https://github.com/GautamBytes/Bitcoin-Timestamp-Verifier.git
   ```
2. **Navigate to the project directory**: 
   ```bash
   cd proof-of-existence
   ```
3. **Install dependencies**: 
   ```bash
   npm install
   ```
4. **Run the development server**: 
   ```bash
   npm run dev
   ```

## Usage
1. **Upload a file**: Click the upload button and select a file from your device.
2. **Verify**: After the file is uploaded, the application will compute the SHA-256 hash and check against the Bitcoin blockchain.
3. **View Results**: The app will display whether the file exists in a transaction on the blockchain or if it was not found.

## API Reference
The application interacts with the Blockstream API to check for transactions associated with the file hashes. The following endpoint is used:
- **Endpoint**: `https://blockstream.info/api/search/raw?script=<hash>`
- **Method**: GET
- **Response**: JSON that contains transaction details or an empty array if no transaction exists.

## Known Issues
- Ensure you are connected to the internet as this application requires API access.
- Check for Cross-Origin Resource Sharing (CORS) issues if encountering network errors.

## Testing
To test the application, use the following pre-verified hash which is known to exist in blockchain transactions:
- **Test Hash**: `a03ab19b866fc585b5cb1812a2f63ca861e7e7643ee5d43fd9346f5c02a2e7d3`
  
Use this hash to verify that your implementation is working as intended.

## Contribution
Feel free to fork the repository and submit pull requests for improvements. Report any issues encountered during usage.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


