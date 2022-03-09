var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function invertPaint(paint) {
    return __awaiter(this, void 0, void 0, function* () {
        var datas = [];
        // console.log(paint, paint.type);
        // FRAME;
        if (paint.type === "FRAME") {
            for (let i = 0; i < paint.children.length; i++) {
                yield getBytesList(paint.children[i], datas);
            }
        }
        if (paint.type === "GROUP") {
            yield getBytesList(paint, datas);
        }
        console.log(datas);
        sendBytes(datas);
    });
}
function getBytesList(paint, datas) {
    return __awaiter(this, void 0, void 0, function* () {
        if (paint.name.indexOf("p_") > -1) {
            console.log(paint.name);
            const bytes = yield paint.exportAsync(paint.exportSettings[0]);
            const name = paint.name.replace("p_", "");
            datas.push({
                name,
                data: bytes,
            });
            // console.log(datas);
        }
        if (paint.children && paint.children.length > 0) {
            for (let i = 0; i < paint.children.length; i++) {
                yield getBytesList(paint.children[i], datas);
            }
        }
    });
}
function sendBytes(datas) {
    return __awaiter(this, void 0, void 0, function* () {
        figma.showUI(__html__, { visible: false });
        // // Send the raw bytes of the file to the worker
        figma.ui.postMessage(datas);
        // const newBytes: Uint8Array = await new Promise((resolve, reject) => {
        //   figma.ui.onmessage = (value) => resolve(value as Uint8Array);
        // });
    });
}
function invertIfApplicable(node) {
    return __awaiter(this, void 0, void 0, function* () {
        // Look for fills on node types that have fills.
        // An alternative would be to do `if ('fills' in node) { ... }
        // var bytes = await node.exportAsync();
        // console.log(node, node.lineHeight, node.type);
        // figma.showUI(__html__, { visible: true });
        // Send the raw bytes of the file to the worker
        // figma.ui.postMessage(bytes);
        // console.log(node.children);
        // const newFills = [];
        console.log(node.type);
        try {
            switch (node.type) {
                case "FRAME": {
                    // Create a new array of fills, because we can't directly modify the old one
                    yield invertPaint(node);
                    // node.fills = newFills;
                    break;
                }
                case "GROUP": {
                    // Create a new array of fills, because we can't directly modify the old one
                    yield invertPaint(node);
                    // node.fills = newFills;
                    break;
                }
                default: {
                    // not supported, silently do nothing
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
// This plugin looks at all the currently selected nodes and inverts the colors
// in their image, if they use an image paint.
Promise.all(figma.currentPage.selection.map((selected) => invertIfApplicable(selected))).then(() => { });
//  node.fills;
