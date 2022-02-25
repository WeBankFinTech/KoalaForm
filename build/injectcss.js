/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs');

function injectCss() {
    return {
        name: 'inline-to-extract',
        generateBundle(options_, bundle) {
            Object.keys(bundle).forEach((name) => {
                const bundleItem = bundle[name];
                if (name === 'index.js') {
                    const dir = path.dirname(bundleItem.facadeModuleId);
                    if (
                        fs.existsSync(path.join(dir, 'style')) &&
                        !fs.existsSync(path.join(dir, 'style/themes'))
                    ) {
                        bundleItem.code = `import './style';\n${bundleItem.code}`;
                    }
                }
            });
        },
    };
}

module.exports = injectCss;
