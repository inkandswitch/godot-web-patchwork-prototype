/**
 * @constructor OVR_multiview2
 */
declare function OVR_multiview2(): void;
declare class OVR_multiview2 {
    /**
     * @type {number}
     */
    FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR: number;
    /**
     * @type {number}
     */
    FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR: number;
    /**
     * @type {number}
     */
    MAX_VIEWS_OVR: number;
    /**
     * @type {number}
     */
    FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR: number;
    /**
     * @param {number} target
     * @param {number} attachment
     * @param {WebGLTexture} texture
     * @param {number} level
     * @param {number} baseViewIndex
     * @param {number} numViews
     * @return {void}
     */
    framebufferTextureMultiviewOVR(target: number, attachment: number, texture: WebGLTexture, level: number, baseViewIndex: number, numViews: number): void;
}
/**
 * @constructor OCULUS_multiview
 */
declare function OCULUS_multiview(): void;
declare class OCULUS_multiview {
    /**
     * @param {number} target
     * @param {number} attachment
     * @param {WebGLTexture} texture
     * @param {number} level
     * @param {number} baseViewIndex
     * @param {number} numViews
     * @return {void}
     */
    framebufferTextureMultisampleMultiviewOVR(target: number, attachment: number, texture: WebGLTexture, level: number, samples: any, baseViewIndex: number, numViews: number): void;
}
