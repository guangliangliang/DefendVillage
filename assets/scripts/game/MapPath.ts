import { _decorator, Component, Vec2, Graphics, Color } from 'cc';
import { LevelData } from '../data/LevelData';

const { ccclass, property } = _decorator;

@ccclass('MapPath')
export class MapPath extends Component {
    @property(Graphics)
    pathRenderer: Graphics | null = null;

    @property
    pathWidth: number = 40;

    pathPoints: Vec2[] = [];

    setPath(points: Vec2[]) {
        this.pathPoints = points;
        this.renderPath();
    }

    renderPath() {
        if (!this.pathRenderer) return;
        
        this.pathRenderer.clear();
        
        if (this.pathPoints.length < 2) return;
        
        this.pathRenderer.strokeColor = new Color(180, 150, 100, 255);
        this.pathRenderer.lineWidth = this.pathWidth;
        
        this.pathRenderer.moveTo(this.pathPoints[0].x, this.pathPoints[0].y);
        
        for (let i = 1; i < this.pathPoints.length; i++) {
            this.pathRenderer.lineTo(this.pathPoints[i].x, this.pathPoints[i].y);
        }
        
        this.pathRenderer.stroke();
    }

    getPathPoints(): Vec2[] {
        return this.pathPoints;
    }
}
