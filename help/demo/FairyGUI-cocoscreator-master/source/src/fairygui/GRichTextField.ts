/// <reference path="GTextField.ts" />

namespace fgui {

    export class RichTextImageAtlas extends cc.SpriteAtlas {

        public getSpriteFrame(key: string): cc.SpriteFrame {
            let pi: PackageItem = UIPackage.getItemByURL(key);
            if (pi) {
                pi.load();
                if (pi.type == PackageItemType.Image)
                    return <cc.SpriteFrame>pi.asset;
                else if (pi.type == PackageItemType.MovieClip)
                    return pi.frames[0].texture;
            }

            return super.getSpriteFrame(key);
        }
    }

    const imageAtlas: RichTextImageAtlas = new RichTextImageAtlas();

    export class GRichTextField extends GTextField {
        public _richText: cc.RichText;

        private _bold: boolean;
        private _italics: boolean;
        private _underline: boolean;

        public linkUnderline: boolean;
        public linkColor: string;

        public constructor() {
            super();

            this._node.name = "GRichTextField";
            this._touchDisabled = false;
            this.linkUnderline = UIConfig.linkUnderline;
        }

        protected createRenderer() {
            this._richText = this._node.addComponent(cc.RichText);
            this._richText.handleTouchEvent = false;
            this.autoSize = AutoSizeType.None;
            this._richText.imageAtlas = imageAtlas;
        }

        public get align(): cc.Label.HorizontalAlign {
            return <cc.Label.HorizontalAlign><any>this._richText.horizontalAlign;
        }

        public set align(value: cc.Label.HorizontalAlign) {
            this._richText.horizontalAlign = <cc.macro.TextAlignment><any>value;
        }

        public get underline(): boolean {
            return this._underline;
        }

        public set underline(value: boolean) {
            if (this._underline != value) {
                this._underline = value;

                this.updateText();
            }
        }

        public get bold(): boolean {
            return this._bold;
        }

        public set bold(value: boolean) {
            if (this._bold != value) {
                this._bold = value;

                this.updateText();
            }
        }

        public get italic(): boolean {
            return this._italics;
        }

        public set italic(value: boolean) {
            if (this._italics != value) {
                this._italics = value;

                this.updateText();
            }
        }

        protected markSizeChanged(): void {
            //RichText??????????????????????????????????????????????????????
        }

        protected updateText(): void {
            var text2: string = this._text;

            if (this._templateVars)
                text2 = this.parseTemplate(text2);

            if (this._ubbEnabled) {
                UBBParser.inst.linkUnderline = this.linkUnderline;
                UBBParser.inst.linkColor = this.linkColor;

                text2 = UBBParser.inst.parse(text2);
            }

            if (this._bold)
                text2 = "<b>" + text2 + "</b>";
            if (this._italics)
                text2 = "<i>" + text2 + "</i>";
            if (this._underline)
                text2 = "<u>" + text2 + "</u>";
            let c = this._color
            if (this._grayed)
                c = ToolSet.toGrayed(c);
            text2 = "<color=" + c.toHEX("#rrggbb") + ">" + text2 + "</color>";

            if (this._autoSize == AutoSizeType.Both) {
                if (this._richText.maxWidth != 0)
                    this._richText.maxWidth = 0;
                this._richText.string = text2;
                if (this.maxWidth != 0 && this._node.width > this.maxWidth)
                    this._richText.maxWidth = this.maxWidth;
            }
            else
                this._richText.string = text2;
        }

        protected updateFont() {
            this.assignFont(this._richText, this._realFont);
        }

        protected updateFontColor() {
            this.assignFontColor(this._richText, this._color);
        }

        protected updateFontSize() {
            let fontSize: number = this._fontSize;
            let font: any = this._richText.font;
            if (font instanceof cc.BitmapFont) {
                if (!(<any>font)._fntConfig.resizable)
                    fontSize = (<any>font)._fntConfig.fontSize;
            }

            this._richText.fontSize = fontSize;
            this._richText.lineHeight = fontSize + this._leading * 2;
        }

        protected updateOverflow() {
            if (this._autoSize == AutoSizeType.Both)
                this._richText.maxWidth = 0;
            else
                this._richText.maxWidth = this._width;
        }

        protected handleSizeChanged(): void {
            if (this._updatingSize)
                return;

            if (this._autoSize != AutoSizeType.Both)
                this._richText.maxWidth = this._width;
        }
    }
}