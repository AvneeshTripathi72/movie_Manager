const Loader = ({ fullscreen = false }) => {
  return (
    <div className={fullscreen ? 'loader fullscreen' : 'loader'}>
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Loader;
