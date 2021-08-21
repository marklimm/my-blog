/**
 * My typing of the sanity Image schema type.  I haven't looked into generating typescript types for sanity schemas yet
 */
export interface Image {
  _type: string
  asset: {
    _type: 'reference'
    _ref: string
  }
}
