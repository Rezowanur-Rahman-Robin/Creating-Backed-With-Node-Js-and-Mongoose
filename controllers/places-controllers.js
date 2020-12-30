const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;
  try{
    place =await Place.findById(placeId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not find a place.',500
    );
    return next(error);
  }
  

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);
  
  }

  res.json({ place: place.toObject({getters: true }) }); // => { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId =async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try{
     places = await Place.find({creator : userId});
  }catch(err){
    const error = new HttpError('Can not find any place for the specific user id.',500);

    return next(error);
  }


  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({ places : places.map(place => place.toObject({ getters : true}))});
  // find method return an array.that's why we have to use the map first.

};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address, creator } = req.body; //this is called object distractering
//const title = req.body.title;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }


  const createdPlace = new Place({
    title,
    description,
    address,
    location:coordinates,
    image:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-photo%2Fimage-human-brain_5013322.htm&psig=AOvVaw3UOaPwZeyaG5LQoYiAtizc&ust=1609428713774000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjXj6mD9u0CFQAAAAAdAAAAABAD',
    creator
  });

  try{
   await createdPlace.save();
  }catch(err){
    const error = new HttpError(
      'Creating place Failed,please try again',500
    );
  }

  
  res.status(201).json({ place: createdPlace });
  //201 is a code for posting new data
};

const updatePlace =async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(  HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not update place.',500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try{
    await place.save();
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not update place.',500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({getters : true}) });
};

const deletePlace =async (req, res, next) => {
  const placeId = req.params.pid;
 
let place;
try{
  place= await Place.findById(placeId);
}catch(err){
  const error = new HttpError('Something wrong,could not detele place',500);
  return next(error);
};

try{
  await place.remove();
}catch(err){
  const error = new HttpError('Could not detele place',500);
  return next(error);
};


  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

//for exporting multiple things
