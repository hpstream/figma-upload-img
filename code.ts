async function invertPaint(paint: SceneNode) {
  var datas: Dataformat[] = [];
  // console.log(paint, paint.type);
  // FRAME;
  if (paint.type === "FRAME") {
    for (let i = 0; i < paint.children.length; i++) {
      await getBytesList(paint.children[i] as GroupNode, datas);
    }
  }
  if (paint.type === "GROUP") {
    await getBytesList(paint, datas);
  }
  console.log(datas);
  sendBytes(datas);
}
async function getBytesList(paint: GroupNode, datas: Dataformat[]) {
  if (paint.name.indexOf("p_") > -1) {
    console.log(paint.name);
    const bytes = await paint.exportAsync(paint.exportSettings[0]);
    const name = paint.name.replace("p_", "");
    datas.push({
      name,
      data: bytes,
    });
    // console.log(datas);
  }
  if (paint.children && paint.children.length > 0) {
    for (let i = 0; i < paint.children.length; i++) {
      await getBytesList(paint.children[i] as GroupNode, datas);
    }
  }
}
interface Dataformat {
  name: string;
  data: Uint8Array;
}
async function sendBytes(datas: Dataformat[]) {
  figma.showUI(__html__, { visible: false });

  // // Send the raw bytes of the file to the worker
  figma.ui.postMessage(datas);
  // const newBytes: Uint8Array = await new Promise((resolve, reject) => {
  //   figma.ui.onmessage = (value) => resolve(value as Uint8Array);
  // });
}

async function invertIfApplicable(node: SceneNode) {
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

        await invertPaint(node);
        // node.fills = newFills;
        break;
      }
      case "GROUP": {
        // Create a new array of fills, because we can't directly modify the old one

        await invertPaint(node);

        // node.fills = newFills;
        break;
      }

      default: {
        // not supported, silently do nothing
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// This plugin looks at all the currently selected nodes and inverts the colors
// in their image, if they use an image paint.
Promise.all(
  figma.currentPage.selection.map((selected) => invertIfApplicable(selected))
).then(() => {});
//  node.fills;
