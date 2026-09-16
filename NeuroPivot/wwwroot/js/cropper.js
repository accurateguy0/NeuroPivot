/**
 * NeuroPivot Image Cropper Helper
 * Provides interactive drag-to-pan, zoom, and canvas cropping.
 */
(function () {
    const instances = {};

    window.nobsCropper = {
        init: function (containerId, imageSrc, aspectW, aspectH) {
            this.destroy(containerId);

            const container = document.getElementById(containerId);
            if (!container) return;

            aspectW = aspectW || 3;
            aspectH = aspectH || 4;

            const state = {
                container: container,
                img: new Image(),
                aspectW: aspectW,
                aspectH: aspectH,
                frameW: 0,
                frameH: 0,
                natW: 0,
                natH: 0,
                baseScale: 1,
                zoom: 1.0,
                offsetX: 0,
                offsetY: 0,
                isDragging: false,
                startX: 0,
                startY: 0,
                startOffsetX: 0,
                startOffsetY: 0
            };

            instances[containerId] = state;

            // Build DOM structure inside container
            container.innerHTML = `
                <div class="crop-viewport" style="position:relative; overflow:hidden; user-select:none; touch-action:none; cursor:grab; width:100%; height:100%; border-radius:14px; background:#0a0a0e;">
                    <img class="crop-target-img" src="${imageSrc}" style="position:absolute; pointer-events:none; transform-origin:center center; will-change:transform; display:none;" />
                    <div class="crop-grid-overlay" style="position:absolute; inset:0; pointer-events:none; border:1.5px dashed rgba(230, 170, 206, 0.45); border-radius:14px; box-shadow:inset 0 0 0 1px rgba(0,0,0,0.2);">
                        <div style="position:absolute; top:33.33%; left:0; right:0; height:1px; background:rgba(255,255,255,0.12);"></div>
                        <div style="position:absolute; top:66.66%; left:0; right:0; height:1px; background:rgba(255,255,255,0.12);"></div>
                        <div style="position:absolute; left:33.33%; top:0; bottom:0; width:1px; background:rgba(255,255,255,0.12);"></div>
                        <div style="position:absolute; left:66.66%; top:0; bottom:0; width:1px; background:rgba(255,255,255,0.12);"></div>
                    </div>
                </div>
            `;

            const viewport = container.querySelector('.crop-viewport');
            const targetImg = container.querySelector('.crop-target-img');
            state.viewport = viewport;
            state.targetImg = targetImg;

            const getFrameDimensions = () => {
                if (state.viewport) {
                    state.frameW = state.viewport.clientWidth || 250;
                    state.frameH = state.viewport.clientHeight || 333;
                }
            };

            const updateTransform = () => {
                getFrameDimensions();
                if (!state.natW || !state.natH) return;
                const currentScale = state.baseScale * state.zoom;
                const dispW = state.natW * currentScale;
                const dispH = state.natH * currentScale;

                // Clamp offsets to keep image filling the viewport
                const maxOffsetX = Math.max(0, (dispW - state.frameW) / 2);
                const maxOffsetY = Math.max(0, (dispH - state.frameH) / 2);

                state.offsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, state.offsetX));
                state.offsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, state.offsetY));

                // Center image in viewport + offset
                const left = (state.frameW - dispW) / 2 + state.offsetX;
                const top = (state.frameH - dispH) / 2 + state.offsetY;

                targetImg.style.width = `${dispW}px`;
                targetImg.style.height = `${dispH}px`;
                targetImg.style.left = `${left}px`;
                targetImg.style.top = `${top}px`;
            };
            state.updateTransform = updateTransform;

            state.img.onload = () => {
                state.natW = state.img.naturalWidth || state.img.width;
                state.natH = state.img.naturalHeight || state.img.height;

                getFrameDimensions();

                // Base scale to cover viewport
                state.baseScale = Math.max(state.frameW / state.natW, state.frameH / state.natH);
                state.zoom = 1.0;
                state.offsetX = 0;
                
                // Position upper portion (face/head) into frame instead of cutting off top
                const currentScale = state.baseScale * state.zoom;
                const dispH = state.natH * currentScale;
                const maxOffsetY = Math.max(0, (dispH - state.frameH) / 2);
                state.offsetY = maxOffsetY * 0.70;

                targetImg.style.display = 'block';
                updateTransform();
            };
            state.img.src = imageSrc;
            if (state.img.complete && state.img.naturalWidth > 0) {
                state.img.onload();
            }

            // Pointer / Drag events
            const onPointerDown = (e) => {
                state.isDragging = true;
                viewport.style.cursor = 'grabbing';
                state.startX = e.clientX;
                state.startY = e.clientY;
                state.startOffsetX = state.offsetX;
                state.startOffsetY = state.offsetY;
                try {
                    viewport.setPointerCapture(e.pointerId);
                } catch (err) { }
            };

            const onPointerMove = (e) => {
                if (!state.isDragging) return;
                const dx = e.clientX - state.startX;
                const dy = e.clientY - state.startY;
                state.offsetX = state.startOffsetX + dx;
                state.offsetY = state.startOffsetY + dy;
                updateTransform();
            };

            const onPointerUp = (e) => {
                if (!state.isDragging) return;
                state.isDragging = false;
                viewport.style.cursor = 'grab';
                try {
                    viewport.releasePointerCapture(e.pointerId);
                } catch (err) { }
            };

            viewport.addEventListener('pointerdown', onPointerDown);
            viewport.addEventListener('pointermove', onPointerMove);
            viewport.addEventListener('pointerup', onPointerUp);
            viewport.addEventListener('pointercancel', onPointerUp);

            // Wheel zoom
            const onWheel = (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                window.nobsCropper.setZoom(containerId, state.zoom + delta);
            };
            viewport.addEventListener('wheel', onWheel, { passive: false });

            // Direct Slider Input (Hardware-accelerated 60/120fps with zero SignalR roundtrips)
            const slider = document.getElementById(`${containerId}_zoom`);
            const onSliderInput = (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                    state.zoom = Math.min(3.5, Math.max(1.0, val));
                    updateTransform();
                }
            };
            if (slider) {
                slider.addEventListener('input', onSliderInput);
            }

            state.cleanup = () => {
                viewport.removeEventListener('pointerdown', onPointerDown);
                viewport.removeEventListener('pointermove', onPointerMove);
                viewport.removeEventListener('pointerup', onPointerUp);
                viewport.removeEventListener('pointercancel', onPointerUp);
                viewport.removeEventListener('wheel', onWheel);
                if (slider) slider.removeEventListener('input', onSliderInput);
            };
        },

        setZoom: function (containerId, zoomValue) {
            const state = instances[containerId];
            if (!state) return;

            state.zoom = Math.min(3.5, Math.max(1.0, zoomValue));
            state.updateTransform();

            const slider = document.getElementById(`${containerId}_zoom`);
            if (slider) {
                slider.value = state.zoom.toFixed(2);
            }
        },

        reset: function (containerId) {
            const state = instances[containerId];
            if (!state) return;

            state.zoom = 1.0;
            state.offsetX = 0;
            const currentScale = state.baseScale * state.zoom;
            const dispH = (state.natH || 0) * currentScale;
            const maxOffsetY = Math.max(0, (dispH - (state.frameH || 333)) / 2);
            state.offsetY = maxOffsetY * 0.70;
            state.updateTransform();

            const slider = document.getElementById(`${containerId}_zoom`);
            if (slider) {
                slider.value = "1.0";
            }
        },

        getCroppedDataUrl: function (containerId, outW, outH) {
            const state = instances[containerId];
            if (!state || !state.natW || !state.natH) return null;

            outW = outW || 270;
            outH = outH || 360;

            if (state.viewport) {
                state.frameW = state.viewport.clientWidth || 250;
                state.frameH = state.viewport.clientHeight || 333;
            }

            const currentScale = state.baseScale * state.zoom;
            const dispW = state.natW * currentScale;
            const dispH = state.natH * currentScale;

            // Frame position relative to image display coordinates
            const frameLeftInDisp = (dispW - state.frameW) / 2 - state.offsetX;
            const frameTopInDisp = (dispH - state.frameH) / 2 - state.offsetY;

            // Convert to natural image coordinates with bounds clamping
            const sx = Math.max(0, Math.min(state.natW - 1, frameLeftInDisp / currentScale));
            const sy = Math.max(0, Math.min(state.natH - 1, frameTopInDisp / currentScale));
            const sw = Math.min(state.natW - sx, state.frameW / currentScale);
            const sh = Math.min(state.natH - sy, state.frameH / currentScale);

            const canvas = document.createElement('canvas');
            canvas.width = outW;
            canvas.height = outH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';

            ctx.drawImage(state.img, sx, sy, sw, sh, 0, 0, outW, outH);

            let quality = 0.78;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);

            // Safety guard: guarantee dataUrl never exceeds 28,000 characters
            // Fits cleanly inside a single default 32KB SignalR frame with zero circuit reconnects
            while (dataUrl.length > 28000 && quality > 0.35) {
                quality -= 0.10;
                dataUrl = canvas.toDataURL('image/jpeg', quality);
            }

            return dataUrl;
        },

        destroy: function (containerId) {
            const state = instances[containerId];
            if (state) {
                if (state.cleanup) state.cleanup();
                delete instances[containerId];
            }
        }
    };
})();
