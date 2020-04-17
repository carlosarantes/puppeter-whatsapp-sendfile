const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {

    try {

        // set some options (set headless to false so we can see 
        // this automated browsing experience)
        let launchOptions = { headless: false, args: ['--start-maximized'] };

        // Launch the browser and a new page
        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        // set viewport and user agent (just in case for nice viewing)
        await page.setViewport({width: 1024, height: 500});
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

        // Verify if the user is not connected
        let stillNotConnected = true;
        do {
            let qr = await page.$('._11ozL');
            stillNotConnected = qr ? true : false;
        } while(stillNotConnected);

        // Go to whatsApp with a specified destination
        await page.goto('https://web.whatsapp.com/send?phone=PHONE_NUMBERR', { waitUntil : "networkidle2" });

        // Verify if the chat is still bing prepared
        let stillLoading = true;
        do {
            let elem = await page.$('._2Qffr');
            stillLoading = elem ? true : false;
        } while(stillLoading);

        // Use a short sleep to "pretend" a user action
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Wait for the attachment button and click and get its bounds.
        await page.waitForSelector('.rAUz7', { timeout : 5000 });
        const boundsRects = await page.evaluate(() => {
            const domBoundRects = document.getElementsByClassName('rAUz7')[4].children[0].getBoundingClientRect();
            return {
                x: domBoundRects.x,
                y: domBoundRects.y  
            };
        });

        // Pretend a mouse action on the bounds rects provided above
        await page.mouse.move((boundsRects.x+12), boundsRects.y );
        await new Promise(resolve => setTimeout(resolve, 400)); // Short promisse to pretend a user action
        await page.mouse.click( (boundsRects.x+12), boundsRects.y );
    
        await new Promise(resolve => setTimeout(resolve, 700)); 
        /* 
            await page.evaluate(() => {
                const btnsFiles = document.getElementsByClassName('_1azEi');
                if(btnsFiles != null && btnsFiles.length > 0) {
                    btnsFiles[0].click();
                }
            }) 
        */

        /*
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#upload-file-button'), // some button that triggers file selection
            ]);
            await fileChooser.accept(['/tmp/myfile.pdf']);
        */

            await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the input files to put our file data 
        const filesInput = await page.$$('input[type=file]'); 

        // Short promisse to pretend a user action
        await new Promise(resolve => setTimeout(resolve, 400));

        if(filesInput != null && filesInput.length > 0) {
            // Select the button you want to manage and put the file on it
            const uploadDoc = filesInput[1];
            uploadDoc.uploadFile( './testepdf.pdf' ).then( (res) => {
                console.log(res);
            }).catch( (err) => {
                console.log(err);
            });
        }

        // Wait for the send button, to send the file to the destination
        await page.waitForSelector('._3hV1n', { timeout : 8000 });
        await page.evaluate(() => {
            const btnSend = document.getElementsByClassName('_3hV1n');
            if(btnSend != null && btnSend.length > 0){
                btnSend[0].click();
            } else {
                console.log('Somnething went wrong.... ');
            }
        });

        await new Promise(resolve => setTimeout(resolve, 800));
    
      //  await browser.close();
    } catch (err) {
        console.log('An error occured. Error: '+err.message)
    }

})();