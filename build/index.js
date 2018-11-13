var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Colors_1 = require("./Colors");
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
exports.name = 'Image Builder';
var logger;
var ChatColor = MineLoaderJ.ChatColor;
var Player = MineLoaderJ.bukkit.entity.Player;
var setBlock = MineLoaderJ.helpers.setBlock;
var Jimp;
function init(inst, _logger) {
    logger = _logger;
    try {
        Jimp = require('jimp');
    }
    catch (err) {
        logger.severe('Npm package `jimp` cannot be loaded, please install it first:', err.message, err.stack);
    }
    // Patch Buffer
    /* let _Buffer = Buffer as any
    _Buffer._from = _Buffer.from;
    _Buffer.from = function() {
      try {
        return _Buffer._from.apply(_Buffer, arguments)
      } catch(err) {
        return Buffer.prototype.constructor.apply(null, arguments)
      }
    } */
}
exports.init = init;
function extractArgument(sender, args) {
    // if(!Jimp) {
    //   sender.sendMessage(ChatColor.RED + 'Npm package `jimp` not found, please install it first')
    //   return true
    // }
    var e_1, _a;
    if (args.length < 4)
        return null;
    var pos;
    try {
        pos = args.slice(1, 4).map(function (v) { return parseInt(v); });
    }
    catch (_b) {
        return null;
    }
    try {
        for (var pos_1 = __values(pos), pos_1_1 = pos_1.next(); !pos_1_1.done; pos_1_1 = pos_1.next()) {
            var c = pos_1_1.value;
            if (isNaN(c))
                return null;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (pos_1_1 && !pos_1_1.done && (_a = pos_1.return)) _a.call(pos_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var scale;
    try {
        scale = parseFloat(args[4]);
        if (scale < 0)
            scale = 1;
    }
    catch (_c) { }
    scale = scale || 1;
    var data = args[0];
    if (!args[0].match(/^https?:\/\//)) {
        try {
            data = new Buffer(data, 'base64');
        }
        catch (_d) {
            sender.sendMessage(ChatColor.RED + 'Invalid image data (base64 encoding)');
            return null;
        }
    }
    var world = null;
    if (sender instanceof Player)
        world = sender.getWorld();
    return {
        data: data,
        world: world,
        pos: pos,
        scale: scale
    };
}
exports.commands = {
    img: {
        description: 'Build image with block',
        usage: '/js img <url | base64 code> <x> <y> <z> [scale]',
        aliases: [],
        onCommand: function (sender, commandName, args) {
            if (!Jimp) {
                sender.sendMessage(ChatColor.RED + 'Npm package `jimp` not found, please install it first');
                return true;
            }
            var res = extractArgument(sender, args);
            if (!res)
                return false;
            var data = res.data, world = res.world, pos = res.pos, scale = res.scale;
            Jimp.read(data)
                .then(function (image) {
                if (scale != 1)
                    image = image.scale(scale);
                var width = image.getWidth();
                var height = image.getHeight();
                function render(row, col) {
                    var _row = row + 10;
                    var _col = col + 10;
                    logger.info("Rendering blocks from (" + row + ", " + col + ") to (" + _row + ", " + _col + ")");
                    for (var y = row; y < _row && y < height; y++) {
                        for (var x = col; x < _col && x < width; x++) {
                            var color = Jimp.intToRGBA(image.getPixelColor(x, y));
                            if (color.a > 128)
                                setBlock(world, pos[0] + x, pos[1], pos[2] + y, 'WOOL', Colors_1.getData(color));
                        }
                    }
                    if (_col >= width) {
                        row += 10;
                        col = 0;
                    }
                    else {
                        col = _col;
                    }
                    if (_row < height || _col < width)
                        setImmediate(render, row, col); // process.nextTick(render, row, col)
                    else
                        logger.info('Image placed');
                }
                setImmediate(render, 0, 0); // process.nextTick(render, 0, 0)
            })
                .catch(function (err) {
                logger.warn('Cannot load image:', err.stack);
            });
            return true;
        }
    },
    imgv: {
        description: 'Build image with block (vertical)',
        usage: '/js imgv <url | base64 code> <x> <y> <z> [scale]',
        aliases: [],
        onCommand: function (sender, commandName, args) {
            if (!Jimp) {
                sender.sendMessage(ChatColor.RED + 'Npm package `jimp` not found, please install it first');
                return true;
            }
            var res = extractArgument(sender, args);
            if (!res)
                return false;
            var data = res.data, world = res.world, pos = res.pos, scale = res.scale;
            Jimp.read(data)
                .then(function (image) {
                if (scale != 1)
                    image = image.scale(scale);
                var width = image.getWidth();
                var height = image.getHeight();
                function render(row, col) {
                    var _row = row + 10;
                    var _col = col + 10;
                    logger.info("Rendering blocks from (" + row + ", " + col + ") to (" + _row + ", " + _col + ")");
                    for (var y = row; y < _row && y < height; y++) {
                        for (var x = col; x < _col && x < width; x++) {
                            var color = Jimp.intToRGBA(image.getPixelColor(x, y));
                            if (color.a > 128)
                                setBlock(world, pos[0] + x, pos[1] - y, pos[2], 'WOOL', Colors_1.getData(color));
                        }
                    }
                    if (_col >= width) {
                        row += 10;
                        col = 0;
                    }
                    else {
                        col = _col;
                    }
                    if (_row < height || _col < width)
                        setImmediate(render, row, col); // process.nextTick(render, row, col)
                    else
                        logger.info('Image placed');
                }
                setImmediate(render, 0, 0); // process.nextTick(render, 0, 0)
            })
                .catch(function (err) {
                logger.warn('Cannot load image:', err.stack);
            });
            return true;
        }
    }
};
//# sourceMappingURL=index.js.map