/**
 * Component Loader Module
 * Handles loading and managing reusable components
 */
class ComponentLoader {
    constructor() {
        this.components = {};
        this.loadedComponents = new Set();
    }

    /**
     * Load a component from file
     * @param {string} componentName - Name of the component
     * @param {string} targetId - Target element ID to insert component
     * @param {Object} options - Additional options
     */
    async loadComponent(componentName, targetId, options = {}) {
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            const target = document.getElementById(targetId);
            
            if (!target) {
                console.error(`Target element not found: ${targetId}`);
                return;
            }

            // Insert the component HTML
            target.innerHTML = html;
            
            // Mark as loaded
            this.loadedComponents.add(componentName);
            
            // Trigger component loaded event
            this.triggerComponentLoaded(componentName, target, options);
            
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }

    /**
     * Load multiple components
     * @param {Array} components - Array of {name, targetId, options}
     */
    async loadComponents(components) {
        const promises = components.map(comp => 
            this.loadComponent(comp.name, comp.targetId, comp.options || {})
        );
        
        await Promise.all(promises);
    }

    /**
     * Trigger component loaded event
     * @param {string} componentName - Name of the component
     * @param {HTMLElement} target - Target element
     * @param {Object} options - Options passed to loadComponent
     */
    triggerComponentLoaded(componentName, target, options) {
        const event = new CustomEvent('componentLoaded', {
            detail: {
                componentName,
                target,
                options
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Check if component is loaded
     * @param {string} componentName - Name of the component
     * @returns {boolean}
     */
    isComponentLoaded(componentName) {
        return this.loadedComponents.has(componentName);
    }

    /**
     * Get component HTML (for inline use)
     * @param {string} componentName - Name of the component
     * @returns {Promise<string>}
     */
    async getComponentHTML(componentName) {
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error getting component HTML ${componentName}:`, error);
            return '';
        }
    }

    /**
     * Replace placeholders in component HTML
     * @param {string} html - Component HTML
     * @param {Object} placeholders - Placeholder values
     * @returns {string}
     */
    replacePlaceholders(html, placeholders) {
        let result = html;
        for (const [key, value] of Object.entries(placeholders)) {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return result;
    }

    /**
     * Load component with placeholders
     * @param {string} componentName - Name of the component
     * @param {string} targetId - Target element ID
     * @param {Object} placeholders - Placeholder values
     * @param {Object} options - Additional options
     */
    async loadComponentWithPlaceholders(componentName, targetId, placeholders = {}, options = {}) {
        try {
            const html = await this.getComponentHTML(componentName);
            const processedHtml = this.replacePlaceholders(html, placeholders);
            
            const target = document.getElementById(targetId);
            if (!target) {
                console.error(`Target element not found: ${targetId}`);
                return;
            }

            target.innerHTML = processedHtml;
            this.loadedComponents.add(componentName);
            this.triggerComponentLoaded(componentName, target, options);
            
        } catch (error) {
            console.error(`Error loading component with placeholders ${componentName}:`, error);
        }
    }
}

// Export instance
const componentLoader = new ComponentLoader();
export default componentLoader; 