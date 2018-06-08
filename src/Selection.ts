import Frame from './Frame';

export default class Selection {
  constructor(
    public id: number = 0,
    public name: String = "",
    public loopType: String = "none",
    public frames: Frame[] = [],
  ) {}
};
